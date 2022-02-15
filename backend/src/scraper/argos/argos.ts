import { RequestInit } from "node-fetch";
import parse, { HTMLElement } from "node-html-parser";
import { AbstractParser } from "../../parser/parser";

export class ArgosParser extends AbstractParser<
  string,
  HTMLElement,
  HTMLElement
> {
  setContent(content: string): void {
    this.content = parse(content);
  }

  buildBody(): RequestInit | null {
    return null;
  }

  parseItemElements(): HTMLElement[] {
    const elements: HTMLElement[] = this.content.querySelectorAll(
      "div[class^=ProductCardstyles__Wrapper-]"
    );

    if (elements.length == 0)
      this.result.parserErrors.push({
        elementIndex: -1,
        expected: "not empty array",
        result: "empty array",
        operation: "parseItemElements",
        severity: "HIGH",
      });

    return elements;
  }

  nextPageExists(): boolean {
    const resultsCountSpan: HTMLElement | null = this.content.querySelector(
      "span[class^=styles__ResultsCount]"
    );

    if (!resultsCountSpan)
      this.result.parserErrors.push({
        elementIndex: -1,
        expected: "not null",
        result: "null",
        operation: "nextPageExists -> resultsCountSpan",
        severity: "HIGH",
      });

    const resultsCount: string =
      resultsCountSpan?.getAttribute("data-search-results") ||
      this.getConfig().itemElementsCountExpected.toString();

    const count: number = parseInt(resultsCount);

    const totalPages = Math.ceil(
      count / this.getConfig().itemElementsCountExpected
    );

    if (this.getConfig().currentPageNumber < totalPages) {
      return true;
    }

    return false;
  }

  parseTitle(itemElement: HTMLElement, index: number): string | undefined {
    const title: string | undefined = itemElement
      .querySelector("a[class*=Title]")
      ?.text.trim();

    if (!title)
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parseTitle",
        severity: "HIGH",
      });

    return title;
  }

  parseUpc(itemElement: HTMLElement, index: number): string | undefined {
    const upc: string | undefined = itemElement.getAttribute("data-product-id");

    if (!upc)
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parseUpc",
        severity: "HIGH",
      });

    return upc;
  }

  parsePrice(itemElement: HTMLElement, index: number): number | undefined {
    const price: number | undefined =
      Number(
        itemElement
          .querySelector("div[class*=PriceText]")
          ?.text?.trim()
          .replace(/[^0-9.-]+/g, "")
      ) || undefined;

    if (!price)
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parsePrice",
        severity: "HIGH",
      });

    return price;
  }

  parseUrl(itemElement: HTMLElement, index: number): string | undefined {
    const url: string | undefined = itemElement.getAttribute("data-product-id")
      ? `https://www.argos.co.uk/product/${itemElement
          .getAttribute("data-product-id")
          ?.trim()}`
      : undefined;

    if (!url)
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parseUrl",
        severity: "HIGH",
      });

    return url;
  }

  parseImage(itemElement: HTMLElement, index: number): string | undefined {
    return undefined;
  }

  parseBrand(itemElement: HTMLElement, index: number): string | undefined {
    return undefined;
  }

  parseModel(itemElement: HTMLElement, index: number): string | undefined {
    return undefined;
  }

  parseNextPageUrl(): string {
    const pageUrlSplit: string[] = this.getConfig().currentUrl.split("page:");
    return `${pageUrlSplit[0]}page:${this.getConfig().currentPageNumber + 1}/`;
  }

  parseNextPageNumber(): number {
    throw new Error("Method not implemented.");
  }
}
