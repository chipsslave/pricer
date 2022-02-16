import {
  StorePage,
  updateToProcessing,
  updateToWaiting,
} from "../service/page.service";
import { Job } from "../service/job";
import { RequestInit } from "node-fetch";
import { Parser, ParserResult } from "./../parser/parser";

export interface NewSpider<T> {
  setStorePage(storePage: StorePage): void;
  setParser(parser: Parser<T>): void;
  run(): Promise<void>;
  closeBrowser(): void | Promise<void>;
}

export abstract class NewBaseSpider<T> implements NewSpider<T> {
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

  async run(): Promise<void> {
    try {
      if (!this.job) throw new Error("Job is invalid.");
      if (!this.storePage) throw new Error("storePage is not set");

      await updateToProcessing(this.storePage);

      const urlHtml: T = await this.fetchContent(
        this.job.getPageUrl(),
        this.parser.buildBody()
      );

      this.parser.setContent(urlHtml);
      this.parser.setConfig({
        currentPageNumber: this.job.getPageNumber(),
        currentUrl: this.job.getPageUrl(),
        itemElementsCountExpected: this.storePage.itemsPerPage,
      });

      const parserResult: ParserResult = this.parser.parse();
      this.job.recordFinishedAt();
      await this.job.save(parserResult);

      if (parserResult.nextPage) {
        this.job = new Job(
          this.storePage,
          parserResult.nextPage.pageUrl,
          parserResult.nextPage.pageNumber
        );
        await this.run();
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.storePage && (await updateToWaiting(this.storePage));
      await this.closeBrowser();
    }
  }
}
