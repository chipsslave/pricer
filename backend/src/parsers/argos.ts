import { Page } from "puppeteer";
import { Page as StorePage } from "@prisma/client";
import { Report } from "../main";
import parse, { HTMLElement } from "node-html-parser";
const crypto = require("crypto");
import { ReportService } from "../service/report.service";

export class Argos {
  storePage: StorePage;
  reports: Report[] = [];
  page: Page;

  reportService: ReportService;

  constructor(storePage: StorePage, page: Page) {
    this.storePage = storePage;
    this.page = page;
    this.reportService = new ReportService(storePage);
  }

  async scrape() {
    await this.page.goto(this.reportService.getCurrentPageUrl(), {
      waitUntil: ["domcontentloaded", "networkidle2"],
    });

    const pageHtml: HTMLElement = parse(await this.page.content());

    const elements: HTMLElement[] = pageHtml.querySelectorAll(
      "div[class^=ProductCardstyles__Wrapper-]"
    );

    this.reportService.setElementsFoundCount(elements.length);

    if (
      this.storePage.itemsPerPage !== this.reportService.getElementsFoundCount()
    )
      this.reportService.handleError({
        expected: `Elements count ${this.storePage.itemsPerPage}`,
        result: `Elements count ${this.reportService.getElementsFoundCount()}`,
        severity:
          this.reportService.getElementsFoundCount() == 0 ? "HIGH" : "LOW",
        operation:
          "Checking if count of parsed elements matches expected count of elements.",
        elementIndex: -1,
      });

    if (this.reportService.getElementsFoundCount() > 0) {
      // parse elements here
      for (const [index, element] of elements.entries()) {
        const elementHash = crypto
          .createHash("md5")
          .update(element.toString())
          .digest("hex");

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
          this.reportService.handleError({
            operation: "parsing title",
            expected: "result should not be null",
            result: "result is null",
            severity: "HIGH",
            element: {
              element: element.outerHTML,
              elementHash,
            },
            elementIndex: index,
          });

        if (!parsedElementItem.upc)
          this.reportService.handleError({
            operation: "parsing upc",
            expected: "result should not be null",
            result: "result is null",
            severity: "HIGH",
            element: {
              element: element.outerHTML,
              elementHash,
            },
            elementIndex: index,
          });
        if (!parsedElementItem.price)
          this.reportService.handleError({
            operation: "parsing price",
            expected: "result should more than 0",
            result: "result is null",
            severity: "HIGH",
            element: {
              element: element.outerHTML,
              elementHash,
            },
            elementIndex: index,
          });
        if (!parsedElementItem.url)
          this.reportService.handleError({
            operation: "parsing url",
            expected: "result should not be empty string",
            result: "result is empty string",
            severity: "HIGH",
            element: {
              element: element.outerHTML,
              elementHash,
            },
            elementIndex: index,
          });

        if (
          parsedElementItem.title &&
          parsedElementItem.upc &&
          parsedElementItem.price &&
          parsedElementItem.url
        ) {
          this.reportService.handleSuccess();
        }
      }
    }

    this.reportService.setNextPageAvailable(
      this.checkNextPageAvailable(
        pageHtml,
        this.reportService.getCurrentPageNumber()
      )
    );

    if (!this.reportService.getNextPageAvailable()) {
      await this.reportService.finish();
    }

    if (this.reportService.getNextPageAvailable()) {
      const nextPageNumber = this.reportService.getCurrentPageNumber() + 1;

      const nextPageUrl = this.parseNextPageUrl(
        this.reportService.getCurrentPageUrl(),
        nextPageNumber
      );
      await this.reportService.finish();
      this.reportService.reset(nextPageUrl, nextPageNumber);
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

    if (!resultsCountSpan && currentPageNumber > this.storePage.pageStartsAt)
      this.reportService.handleError({
        expected: "resultsCountSpan should not return null",
        result: "resultsCountSpan should not returned null",
        severity: "HIGH",
        operation: "Checking if next page is available.",
        elementIndex: -1,
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
