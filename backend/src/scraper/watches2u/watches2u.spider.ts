import { StorePage } from "../../service/page.service";
import { Job } from "../../mediator/jobService.component";
import { ParserResult } from "../../mediator/parserService.component";
import { Watches2uParserServiceComponent } from "./watches2u.parser";
const fetch = require("node-fetch");

export class Watches2uSpider {
  private parser: Watches2uParserServiceComponent =
    new Watches2uParserServiceComponent();
  private storePage: StorePage;
  private job: Job | null;

  constructor(storePage: StorePage) {
    this.storePage = storePage;
    this.job = new Job(storePage, storePage.url, storePage.pageStartsAt);
  }

  async crawl(): Promise<void> {
    try {
      if (!this.job) throw new Error("Job is invalid.");

      const response = await fetch(this.job.getPageUrl(), {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:96.0) Gecko/20100101 Firefox/96.0",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "en-GB,en;q=0.5",
          "Upgrade-Insecure-Requests": "1",
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "none",
          "Sec-Fetch-User": "?1",
        },
        method: "GET",
      });

      if (!response.ok) {
        console.log({ response });
        throw new Error("Response is not OK.");
      }

      const data: string = await response.text();

      this.parser.setup(
        this.storePage,
        data,
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
    }
  }
}
