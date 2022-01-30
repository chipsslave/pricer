import { BrowserClient } from "../../BrowserClient";
import { StorePage } from "../../service/page.service";
import { Job } from "../../mediator/jobService.component";
import { Parser, ParserResult } from "../../mediator/parserService.component";
import { ArgosParserServiceComponent } from "./argos.parser";

export class ArgosSpider {
  private parser: Parser = new ArgosParserServiceComponent();
  private storePage: StorePage;
  private job: Job | null;
  private browserClient: BrowserClient = new BrowserClient();

  constructor(storePage: StorePage) {
    this.storePage = storePage;
    this.job = new Job(storePage, storePage.url, storePage.pageStartsAt);
  }

  async crawl(): Promise<void> {
    try {
      if (!this.job) throw new Error("Job is invalid.");

      await this.browserClient.launch();
      await this.browserClient.goTo(this.job.getPageUrl());
      const urlHtml: string = await this.browserClient.getPageHtmlContent();
      this.parser.setup(
        this.storePage,
        urlHtml,
        this.job.getPageUrl(),
        this.job.getPageNumber()
      );
      const parserResult: ParserResult = this.parser.parse();
      this.job.processParserResults({ ...parserResult });
      this.job.recordFinishedAt();
      await this.job.save();

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
      await this.browserClient.close();
    }
  }
}
