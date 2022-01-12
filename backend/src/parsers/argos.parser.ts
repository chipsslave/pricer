import { HTMLElement } from "node-html-parser";

export interface Parser {
  parseItemElements(pageContent: HTMLElement): HTMLElement[];
  checkNextPageAvailable(
    pageHtml: HTMLElement,
    currentPageNumber: number
  ): boolean;
}

export class ArgosParser implements Parser {
  parseItemElements(pageContent: HTMLElement): HTMLElement[] {
    return pageContent.querySelectorAll(
      "div[class^=ProductCardstyles__Wrapper-]"
    );
  }

  checkNextPageAvailable(
    pageContent: HTMLElement,
    currentPageNumber: number
  ): boolean {
    const resultsCountSpan: HTMLElement | null = pageContent.querySelector(
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
}

export default new ArgosParser();
