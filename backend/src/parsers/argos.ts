import { Page } from "puppeteer";
import { Page as StorePage } from "@prisma/client";
import { Report, ReportError } from "../main";
import parse, { HTMLElement } from "node-html-parser";
import moment from "moment";
const crypto = require("crypto");

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
      page: this.storePage,
      pageUrl: this.nextPageUrl,
      pageNumber: this.currentPageNumber,
      errors: [],
      nextPageAvailable: false,
      parsedElementItemsSuc: 0,
      parsedElementItemsFail: 0,
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
      page: this.storePage,
      pageUrl: this.nextPageUrl,
      pageNumber: this.currentPageNumber,
      errors: [],
      nextPageAvailable: false,
      parsedElementItemsSuc: 0,
      parsedElementItemsFail: 0,
    };
  }

  async scrape() {
    await this.page.goto(this.nextPageUrl, {
      waitUntil: ["domcontentloaded", "networkidle2"],
    });

    const pageHtml: HTMLElement = parse(await this.page.content());

    const elements: HTMLElement[] = pageHtml.querySelectorAll(
      "div[class^=ProductCardstyles__Wrapper-]"
    );

    this.currentReport.elementsFound = elements.length;

    if (this.storePage.itemsPerPage !== this.currentReport.elementsFound)
      this.onError({
        expected: `Elements count ${this.storePage.itemsPerPage}`,
        result: `Elements count ${this.currentReport.elementsFound}`,
        severity: this.currentReport.elementsFound == 0 ? "high" : "low",
        operation:
          "Checking if count of parsed elements matches expected count of elements.",
      });

    if (this.currentReport.elementsFound > 0) {
      // parse elements here
      for (const [index, element] of elements.entries()) {
        const parsedElementItem = {
          title: element.querySelector("a[class*=Title]")?.text.trim() || null,
          upc: element.getAttribute("data-product-id")
            ? `A_${element.getAttribute("data-product-id")?.trim()}`
            : null,
          price:
            Number(
              element
                .querySelector("div[class*=PriceText]")
                ?.text?.trim()
                .replace(/[^0-9.-]+/g, "")
            ) || null,
          url: element.getAttribute("data-product-id")
            ? `https://www.argos.co.uk/product/${element
                .getAttribute("data-product-id")
                ?.trim()}`
            : null,
        };

        if (!parsedElementItem.title)
          this.onError({
            operation: "parsing title",
            expected: "result should not be null",
            result: "result is null",
            severity: "high",
            element: element.outerHTML,
            elementHash: crypto
              .createHash("md5")
              .update(element.toString())
              .digest("hex"),
            elementIndex: index,
          });

        if (!parsedElementItem.upc)
          this.onError({
            operation: "parsing upc",
            expected: "result should not be null",
            result: "result is null",
            severity: "high",
            // element: element.toString(),
            elementHash: crypto
              .createHash("md5")
              .update(element.toString())
              .digest("hex"),
            elementIndex: index,
          });
        if (!parsedElementItem.price)
          this.onError({
            operation: "parsing price",
            expected: "result should more than 0",
            result: "result is null",
            severity: "high",
            // element: element.toString(),
            elementHash: crypto
              .createHash("md5")
              .update(element.toString())
              .digest("hex"),
            elementIndex: index,
          });
        if (!parsedElementItem.url)
          this.onError({
            operation: "parsing url",
            expected: "result should not be empty string",
            result: "result is empty string",
            severity: "high",
            // element: element.toString(),
            elementHash: crypto
              .createHash("md5")
              .update(element.toString())
              .digest("hex"),
            elementIndex: index,
          });

        if (
          !parsedElementItem.title ||
          !parsedElementItem.upc ||
          !parsedElementItem.price ||
          !parsedElementItem.url
        ) {
          this.currentReport.parsedElementItemsFail += 1;
        } else {
          this.currentReport.parsedElementItemsSuc += 1;
        }

        // console.log({ parsedElementItem });
      }
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
    const resultsCountSpan: HTMLElement | null = pageHtml.querySelector(
      "span[class^=styles__ResultsCount]"
    );

    if (
      !resultsCountSpan &&
      this.currentPageNumber > this.storePage.pageStartsAt
    )
      this.onError({
        expected: "resultsCountSpan should not return null",
        result: "resultsCountSpan should not returned null",
        severity: "high",
        operation: "Checking if next page is available.",
      });
    const resultsCount: string =
      resultsCountSpan?.getAttribute("data-search-results") ||
      this.storePage.itemsPerPage.toString();
    const count: number = parseInt(resultsCount);
    const totalPages = Math.ceil(count / this.storePage.itemsPerPage);
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
