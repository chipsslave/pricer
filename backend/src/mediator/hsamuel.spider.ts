import { RootHSamuel } from "./hs.types";
import { StorePage } from "../service/page.service";
import { Job } from "./jobService.component";
import {
  HSamuelParserServiceComponent,
  ParserResult,
} from "./parserService.component";
const fetch = require("node-fetch");

export class HSamuelSpider {
  private parser: HSamuelParserServiceComponent =
    new HSamuelParserServiceComponent();
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
          Accept: "*/*",
          "Accept-Language": "en-GB,en;q=0.5",
          "x-algolia-api-key": "b00c700f18de421743f8fe6d67c7f0c8",
          "x-algolia-application-id": "4ZMIVJGJ4Y",
          "content-type": "application/x-www-form-urlencoded",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "cross-site",
        },
        referrer: "https://www.hsamuel.co.uk/",
        body: this.storePage.body?.replace(
          "highlight__&page=0",
          `highlight__&page=${this.job.getPageNumber()}`
        ),
        method: "POST",
      });

      if (!response.ok) {
        console.log({ response });
        throw new Error("Response is not OK.");
      }

      const data: RootHSamuel = (await response.json()) as RootHSamuel;

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
          this.storePage.url,
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
