import { RequestInit } from "node-fetch";
import { Parser, ParserResult } from "../parser/parser";
import { Job } from "../service/job";
import {
  StorePage,
  updateToProcessing,
  updateToWaiting,
} from "../service/page.service";

export interface Spider<T> {
  setStorePage(storePage: StorePage): void;
  setParser(parser: Parser<T>): void;
  crawl(): Promise<void>;
  closeBrowser(): void | Promise<void>;
}

export abstract class BaseSpider<T> implements Spider<T> {
  storePage: StorePage;
  job: Job | null;
  parser: Parser<T>;

  setStorePage(storePage: StorePage): void {
    this.storePage = storePage;
    this.job = new Job(storePage, storePage.url, storePage.pageStartsAt);
  }

  setParser(parser: Parser<T>): void {
    this.parser = parser;
  }

  abstract closeBrowser(): void | Promise<void>;
  abstract fetchContent(url: string, body?: RequestInit | null): Promise<T>;

  async crawl(): Promise<void> {
    try {
      if (!this.job) throw new Error("Job is invalid.");
      if (!this.storePage) throw new Error("storePage is not set");

      await updateToProcessing(this.storePage);

      this.parser.setConfig({
        currentPageNumber: this.job.getPageNumber(),
        currentUrl: this.job.getPageUrl(),
        itemElementsCountExpected: this.storePage.itemsPerPage,
        body: this.storePage.body,
      });

      const urlHtml: T = await this.fetchContent(
        this.job.getPageUrl(),
        this.parser.buildBody()
      );

      this.parser.setContent(urlHtml);

      const parserResult: ParserResult = this.parser.parse();
      this.job.recordFinishedAt();
      await this.job.save(parserResult);

      if (parserResult.nextPage) {
        this.job = new Job(
          this.storePage,
          parserResult.nextPage.pageUrl,
          parserResult.nextPage.pageNumber
        );
        await this.crawl();
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.storePage && (await updateToWaiting(this.storePage));
      await this.closeBrowser();
    }
  }
}
