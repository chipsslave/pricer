import { PageService, StorePage } from "./service/page.service";
import { BrowserClient } from "./BrowserClient";
import { PageContent } from "./main";
import argosParser, { Parser } from "./parsers/argos.parser";
import { HTMLElement } from "node-html-parser";
import { ReportService } from "./service/report.service";

export class Crawler {
  private pageService: PageService;
  private browserClient: BrowserClient;
  private storePage: StorePage;
  private reportService: ReportService;
  private parser: Parser;

  constructor() {
    this.pageService = new PageService();
  }

  async initBrowser(): Promise<void> {
    this.browserClient = new BrowserClient();
    await this.browserClient.launch();
  }
  async fetchStorePageContent(): Promise<void> {
    await this.browserClient.goTo(this.reportService.getCurrentPageUrl());
  }
  newPageContentAvailable(): void {
    const pageContent: PageContent = this.browserClient.getLastPage();
    console.log({
      url: pageContent.url,
      content: pageContent.content.toString().substring(0, 20),
    });
  }

  async run() {
    const storePage: StorePage | null = await this.pageService.checkForPage();

    if (storePage !== null) {
      this.storePage = storePage;
      this.reportService = new ReportService(this.storePage);
      this.pageService.updateToProcessing({ ...this.storePage });
      await this.initBrowser();

      if (this.storePage.store.title === "Argos") {
        this.parser = argosParser;
      }

      await this.crawlPage();

      this.pageService.updateToWaiting({ ...this.storePage });

      await this.browserClient.close();
    }
  }

  async crawlPage() {
    await this.fetchStorePageContent();

    const elements: HTMLElement[] = this.parser.parseItemElements(
      this.browserClient.getLastPage().content
    );

    this.reportService.setCurrentReportElements(elements);

    if (elements.length > 0) {
      // process item elements
    }

    this.reportService.setNextPageAvailable(
      this.parser.checkNextPageAvailable(
        this.browserClient.getLastPage().content,
        this.reportService.getCurrentPageNumber()
      )
    );

    if (!this.reportService.getNextPageAvailable()) {
      await this.reportService.finish();
    }

    if (this.reportService.getNextPageAvailable()) {
      const nextPageNumber = this.reportService.getCurrentPageNumber() + 1;

      const nextPageUrl = this.parser.parseNextPageUrl(
        this.reportService.getCurrentPageUrl(),
        nextPageNumber
      );
      await this.reportService.finish();
      this.reportService.reset(nextPageUrl, nextPageNumber);
      await this.crawlPage();
    }
  }
}
