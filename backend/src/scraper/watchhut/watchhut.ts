import { RequestInit } from "node-fetch";
import parse, { HTMLElement } from "node-html-parser";
import { AbstractParser } from "../../parser/parser";

export class WatchHutParser extends AbstractParser<
  string,
  HTMLElement,
  HTMLElement
> {
  constructor() {
    super("WH_");
  }
  setContent(content: string): void {
    this.content = parse(content);
  }

  buildBody(): RequestInit | null {
    return null;
  }

  parseItemElements(): HTMLElement[] {
    const elements: HTMLElement[] = this.content.querySelectorAll("div.match");

    if (elements.length == 0)
      this.result.parserErrors.push({
        elementIndex: -1,
        expected: "not empty array",
        result: "empty array",
        operation: "parseItemElements",
        severity: "HIGH",
      });

    if (elements.length < this.getConfig().itemElementsCountExpected)
      this.result.parserErrors.push({
        elementIndex: -1,
        expected: `count of ${
          this.getConfig().itemElementsCountExpected
        } elements`,
        result: `count of ${elements.length} elements`,
        operation: "parseItemElements",
        severity: "LOW",
      });

    if (elements.length > this.getConfig().itemElementsCountExpected)
      this.result.parserErrors.push({
        elementIndex: -1,
        expected: `count of ${
          this.getConfig().itemElementsCountExpected
        } elements`,
        result: `count of ${elements.length} elements`,
        operation: "parseItemElements",
        severity: "MEDIUM",
      });

    return elements;
  }

  nextPageExists(): boolean {
    const items = this.content.querySelectorAll("div.match");
    if (items.length < this.getConfig().itemElementsCountExpected) {
      return false;
    }
    return true;
  }

  parseTitle(itemElement: HTMLElement, index: number): string | undefined {
    const div: HTMLElement | null = itemElement.querySelector(
      ".productTitle.plp-truncate"
    );
    if (!div) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parseTitle -> div",
        severity: "HIGH",
      });
      return undefined;
    }
    const title: string = div.text.trim();
    if (!title) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parseTitle -> title",
        severity: "HIGH",
      });
      return undefined;
    }
    return title;
  }

  parseUpc(itemElement: HTMLElement, index: number): string | undefined {
    const productText: HTMLElement | null =
      itemElement.querySelector("div.product-text");
    if (!productText) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parseUpc -> productText",
        severity: "HIGH",
      });
      return undefined;
    }

    const meta: HTMLElement | null = productText.querySelector(
      "meta[itemprop=productID]"
    );
    if (!meta) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parseUpc -> meta",
        severity: "HIGH",
      });
      return undefined;
    }

    const upc: string | undefined = meta.getAttribute("content")?.trim();
    if (!upc) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parseUpc -> upc",
        severity: "HIGH",
      });
      return undefined;
    }

    return upc;
  }

  parsePrice(itemElement: HTMLElement, index: number): number | undefined {
    const div: HTMLElement | null = itemElement.querySelector(
      "div.priceNowLarge.current"
    );
    if (!div) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parsePrice -> div",
        severity: "HIGH",
      });
      return undefined;
    }

    const content: string | undefined = div.getAttribute("content")?.trim();
    if (!content) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parsePrice -> content",
        severity: "HIGH",
      });
      return undefined;
    }

    const price: number = parseFloat(content);
    if (!(price > 0)) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "price to be more than 0",
        result: `price: ${price}`,
        operation: "parsePrice -> price",
        severity: "HIGH",
      });
      return undefined;
    }

    return price;
  }

  parseUrl(itemElement: HTMLElement, index: number): string | undefined {
    const a: HTMLElement | null = itemElement.querySelector("a");
    if (!a) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parseUrl -> a",
        severity: "HIGH",
      });
      return undefined;
    }
    const url: string | undefined = a.getAttribute("href");
    if (!url) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parseUrl -> url",
        severity: "HIGH",
      });
      return undefined;
    }
    return `https://www.thewatchhut.co.uk${url}`;
  }

  parseImage(itemElement: HTMLElement, index: number): string | undefined {
    const a: HTMLElement | null = itemElement.querySelector("a");
    if (!a) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parseImage -> a",
        severity: "HIGH",
      });
      return undefined;
    }
    const div: HTMLElement | null = a.querySelector("div");
    if (!div) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parseImage -> div",
        severity: "HIGH",
      });
      return undefined;
    }
    const url: string | undefined = div.getAttribute("data-img-src");
    if (!url) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parseImage -> url",
        severity: "HIGH",
      });
      return undefined;
    }

    return `https://www.thewatchhut.co.uk${url}`;
  }

  parseBrand(itemElement: HTMLElement, index: number): string | undefined {
    const div: HTMLElement | null = itemElement.querySelector(
      "div[itemprop=brand]"
    );
    if (!div) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parseBrand -> div",
        severity: "HIGH",
      });
      return undefined;
    }

    const meta: HTMLElement | null = div.querySelector("meta[itemprop=name]");
    if (!meta) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parseBrand -> meta",
        severity: "HIGH",
      });
      return undefined;
    }

    const brand: string | undefined = meta.getAttribute("content")?.trim();
    if (!brand) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parseBrand -> brand",
        severity: "HIGH",
      });
      return undefined;
    }

    if (brand.endsWith("Jewellery")) {
      const b: string = brand.replace("Jewellery", "").trim();

      if (!b) {
        this.result.parserErrors.push({
          elementIndex: index,
          expected: "not null",
          result: "null",
          operation: "parseBrand -> b",
          severity: "HIGH",
        });
        return undefined;
      }

      return b;
    }

    return brand;
  }

  parseModel(itemElement: HTMLElement, index: number): string | undefined {
    const productText: HTMLElement | null =
      itemElement.querySelector("div.product-text");
    if (!productText) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parseModel -> productText",
        severity: "HIGH",
      });
      return undefined;
    }

    const meta: HTMLElement | null =
      productText.querySelector("meta[itemprop=mpn]");
    if (!meta) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parseModel -> meta",
        severity: "HIGH",
      });
      return undefined;
    }

    const model: string | undefined = meta.getAttribute("content")?.trim();
    if (!model) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parseModel -> model",
        severity: "HIGH",
      });
      return undefined;
    }

    return model;
  }

  parseNextPageUrl(): string {
    const pageUrlSplit: string[] = this.getConfig().currentUrl.split("&page=");
    return `${pageUrlSplit[0]}&page=${this.getConfig().currentPageNumber + 1}`;
  }

  parseNextPageNumber(): number {
    return this.getConfig().currentPageNumber + 1;
  }
}
