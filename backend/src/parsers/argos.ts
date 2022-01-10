import { Page } from "puppeteer";
import { Page as StorePage } from "@prisma/client";
import { Report, ReportError } from "../main";
import parse, { HTMLElement } from "node-html-parser";
import moment from "moment";

export class Argos {
  storePage: StorePage;
  reports: Report[] = [];
  page: Page;

  currentPageNumber: number;
  nextPageAvailable: boolean;
  nextPageUrl: string;
  currentReport: Report;

  constructor(storePage: StorePage, page: Page) {
    this.storePage = storePage;
    this.page = page;
    this.currentPageNumber = storePage.pageStartsAt;
    this.nextPageAvailable = true;
    this.nextPageUrl = storePage.url;
    this.currentReport = {
      startedAt: moment().toDate(),
      pageUrl: this.nextPageUrl,
      pageNumber: this.currentPageNumber,
      errors: [],
      nextPageAvailable: false,
    };
  }

  onError(error: ReportError) {
    this.currentReport.errors.push(error);
  }

  onReportFinish() {
    this.currentReport.finishedAt = moment().toDate();
    console.log(this.currentReport);
  }

  resetReport() {
    this.currentReport = {
      startedAt: moment().toDate(),
      pageUrl: this.nextPageUrl,
      pageNumber: this.currentPageNumber,
      errors: [],
      nextPageAvailable: false,
    };
  }

  async scrape() {
    await this.page.goto(this.nextPageUrl, {
      waitUntil: "domcontentloaded",
    });

    const pageHtml: HTMLElement = parse(await this.page.content());

    const elements: HTMLElement[] = pageHtml.querySelectorAll(
      "div[class^=ProductCardstyles__Wrapper-]"
    );

    this.currentReport.elementsFound = elements.length;

    if (this.storePage.itemsPerPage !== this.currentReport.elementsFound)
      this.onError({
        expected: `Elements count ${this.storePage.itemsPerPage}`,
        received: `Elements count ${this.currentReport.elementsFound}`,
        severity: this.currentReport.elementsFound == 0 ? "high" : "low",
        operation:
          "Checking if count of parsed elements matches expected count of elements.",
      });

    if (this.currentReport.elementsFound > 0) {
      // parse elements here
      // parse elements here
    }

    this.currentReport.nextPageAvailable = this.checkNextPageAvailable(
      pageHtml,
      this.currentPageNumber
    );

    if (!this.currentReport.nextPageAvailable) {
      this.onReportFinish();
      this.resetReport();
      this.nextPageAvailable = false;
    }

    if (this.currentReport.nextPageAvailable) {
      this.currentPageNumber += 1;
      this.nextPageUrl = this.parseNextPageUrl(
        this.nextPageUrl,
        this.currentPageNumber
      );
      this.onReportFinish();
      this.resetReport();
      await this.scrape();
    }
  }

  checkNextPageAvailable(
    pageHtml: HTMLElement,
    currentPageNumber: number
  ): boolean {
    const resultsCount: string =
      pageHtml
        .querySelector("span[class^=styles__ResultsCount]")
        ?.getAttribute("data-search-results") || "63";
    const count: number = parseInt(resultsCount);
    const totalPages = Math.ceil(count / 63);
    if (currentPageNumber < totalPages) {
      return true;
    }
    return false;
  }

  parseNextPageUrl(pageUrl: string, currentPageNumber: number): string {
    const pageUrlSplit: string[] = pageUrl.split("page:");
    return `${pageUrlSplit[0]}page:${currentPageNumber}/`;
  }
}
