import { FetchClient } from "../browser/fetchClient";
import {
  StorePage,
  updateToProcessing,
  updateToWaiting,
} from "../service/page.service";
import { Job } from "./jobService.component";
import { Parser, ParserResult } from "./parserService.component";

export class FetchJsonSpider {
  private browser: FetchClient = new FetchClient();
  private parser: Parser<unknown>;
  private storePage: StorePage;
  private job: Job | null;

  constructor(parser: Parser<unknown>) {
    this.parser = parser;
  }

  setStorePage(storePage: StorePage): void {
    this.storePage = storePage;
    this.job = new Job(storePage, storePage.url, storePage.pageStartsAt);
  }

  async run(): Promise<void> {
    try {
      if (!this.job) throw new Error("Job is invalid.");
      if (!this.storePage) throw new Error("storePage is not set");

      this.parser.setup(
        this.storePage,
        this.job.getPageUrl(),
        this.job.getPageNumber()
      );
      await updateToProcessing(this.storePage);
      if (!this.browser) throw new Error("browser is not set");
      const data: unknown = await this.browser.fetchJson(
        this.job.getPageUrl(),
        this.parser.buildBody()
      );
      const parserResult: ParserResult = this.parser.parse(data);
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
    }
  }
}
