import {
  StorePage,
  updateToProcessing,
  updateToWaiting,
} from "../service/page.service";
import { Job } from "../service/jobService.component";
import { Parser, ParserResult } from "../parser/parserService.component";

export interface Spider<T> {
  setStorePage(storePage: StorePage): void;
  setParser(parser: Parser<T>): void;
  run(): Promise<void>;
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
  abstract fetchContent(url: string, body?: unknown): Promise<T>;

  async run(): Promise<void> {
    try {
      if (!this.job) throw new Error("Job is invalid.");
      if (!this.storePage) throw new Error("storePage is not set");

      await updateToProcessing(this.storePage);
      this.parser.setup(
        this.storePage,
        this.job.getPageUrl(),
        this.job.getPageNumber()
      );
      const urlHtml: T = this.parser.buildBody()
        ? await this.fetchContent(
            this.job.getPageUrl(),
            this.parser.buildBody()
          )
        : await this.fetchContent(this.job.getPageUrl());
      const parserResult: ParserResult = this.parser.parse(urlHtml);
      this.job.processParserResults({ ...parserResult });
      this.job.recordFinishedAt();
      await this.job.save();

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
