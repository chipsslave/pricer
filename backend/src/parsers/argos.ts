import { Page } from "puppeteer";
import { Page as StorePage } from "@prisma/client";
import { Report } from "../main";
import parse, { HTMLElement } from "node-html-parser";
import moment from "moment";

export async function argos(
  storePage: StorePage,
  reports: Report[],
  page: Page
) {
  let currentPageNumber: number = storePage.pageStartsAt;
  let nextPageAvailable: boolean = true;
  let nextPageUrl: string = storePage.url;

  while (nextPageAvailable) {
    const report: Report = {
      startedAt: moment().toDate(),
      page: nextPageUrl,
      pageNumber: currentPageNumber,
      errors: [],
      nextPageAvailable: false,
    };

    await page.goto(nextPageUrl, {
      waitUntil: "domcontentloaded",
    });

    const pageHtml: HTMLElement = parse(await page.content());

    const elements: HTMLElement[] = pageHtml.querySelectorAll(
      "div[class^=ProductCardstyles__Wrapper-]"
    );

    report.elementsFound = elements.length;

    if (storePage.itemsPerPage !== report.elementsFound)
      report.errors.push({
        expected: `Elements count ${storePage.itemsPerPage}`,
        received: `Elements count ${report.elementsFound}`,
      });

    if (report.elementsFound > 0) {
      // parse elements here
      // parse elements here
    }

    report.nextPageAvailable = checkNextPageAvailable(
      pageHtml,
      currentPageNumber
    );

    if (report.nextPageAvailable) {
      currentPageNumber += 1;
      nextPageUrl = parseNextPageUrl(nextPageUrl, currentPageNumber);
    }

    if (!report.nextPageAvailable) {
      nextPageAvailable = false;
    }

    report.finishedAt = moment().toDate();
    reports.push(report);
  }
}

const checkNextPageAvailable = (
  pageHtml: HTMLElement,
  currentPageNumber: number
): boolean => {
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
};

const parseNextPageUrl = (
  pageUrl: string,
  currentPageNumber: number
): string => {
  const pageUrlSplit: string[] = pageUrl.split("page:");
  return `${pageUrlSplit[0]}page:${currentPageNumber}/`;
};
