import {
  NodeHTMLParser,
  ParsedItem,
} from "../../mediator/parserService.component";
import { HTMLElement } from "node-html-parser";

export class ArgosParser extends NodeHTMLParser {
  constructor() {
    super("A_");
  }

  parseItemElements(): HTMLElement[] {
    const elements: HTMLElement[] = this.pageContentParsed.querySelectorAll(
      "div[class^=ProductCardstyles__Wrapper-]"
    );
    return elements;
  }
  nextPageAvailable(): boolean {
    const resultsCountSpan: HTMLElement | null =
      this.pageContentParsed.querySelector("span[class^=styles__ResultsCount]");

    if (
      !resultsCountSpan &&
      this.result.pageNumber > this.result.page.pageStartsAt
    )
      this.result.parserErrors.push({
        expected: "resultsCountSpan should not return null",
        result: "resultsCountSpan should not returned null",
        severity: "HIGH",
        operation: "Checking if next page is available.",
        elementIndex: -1,
      });
    const resultsCount: string =
      resultsCountSpan?.getAttribute("data-search-results") ||
      this.result.page.itemsPerPage.toString();
    const count: number = parseInt(resultsCount);
    const totalPages = Math.ceil(count / this.result.page.itemsPerPage);
    if (this.result.pageNumber < totalPages) {
      return true;
    }
    return false;
  }
  parseNextPageUrl(): string {
    const pageUrlSplit: string[] = this.result.pageUrl.split("page:");
    return `${pageUrlSplit[0]}page:${this.result.pageNumber + 1}/`;
  }

  parseItem(element: HTMLElement): ParsedItem {
    const item: ParsedItem = {
      title: element.querySelector("a[class*=Title]")?.text.trim() || null,
      upc: element.getAttribute("data-product-id")
        ? `${this.getUpcCode()}${element
            .getAttribute("data-product-id")
            ?.trim()}`
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
    return item;
  }
}
