import {
  buildBrowser,
  buildHeadlessBrowser,
  PuppeteerClient,
} from "../browser/puppeteerClient";
import {
  StorePage,
  updateToProcessing,
  updateToWaiting,
} from "../service/page.service";
import { Job } from "./jobService.component";
import { Parser, ParserResult } from "./parserService.component";

export class PuppeteerSpider {
  private headless: boolean;
  private browser: PuppeteerClient | null;
  private parser: Parser<string>;
  private storePage: StorePage;
  private job: Job | null;

  constructor(parser: Parser<string>, headless: boolean) {
    this.parser = parser;
    this.headless = headless;
  }

  private async setupBrowser(): Promise<void> {
    if (!this.browser) {
      this.browser = this.headless
        ? await buildHeadlessBrowser()
        : await buildBrowser();
    }
  }

  private async closeBrowser(): Promise<void> {
    await this.browser?.close();
    this.browser = null;
  }

  setStorePage(storePage: StorePage): void {
    this.storePage = storePage;
    this.job = new Job(storePage, storePage.url, storePage.pageStartsAt);
  }

  async run(): Promise<void> {
    try {
      if (!this.job) throw new Error("Job is invalid.");
      if (!this.storePage) throw new Error("storePage is not set");

      await updateToProcessing(this.storePage);
      await this.setupBrowser();
      if (!this.browser) throw new Error("browser is not set");
      await this.browser.goTo(this.job.getPageUrl());
      const urlHtml: string = await this.browser.getPageHtmlContent();
      this.parser.setup(
        this.storePage,
        this.job.getPageUrl(),
        this.job.getPageNumber()
      );
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
      this.browser && (await this.closeBrowser());
    }
  }
}
