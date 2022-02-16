import { RequestInit } from "node-fetch";
import parse, { HTMLElement } from "node-html-parser";
import { AbstractParser } from "../../parser/parser";
import crypto from "crypto";

export class JuraParser extends AbstractParser<
  string,
  HTMLElement,
  HTMLElement
> {
  constructor() {
    super("JURA_");
  }

  setContent(content: string): void {
    this.content = parse(content);
  }
  buildBody(): RequestInit | null {
    return null;
  }
  parseItemElements(): HTMLElement[] {
    const elements: HTMLElement[] =
      this.content.querySelectorAll("div.product");

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
    const items = this.content.querySelectorAll("div.product");
    if (items.length < this.getConfig().itemElementsCountExpected) {
      return false;
    }
    return true;
  }
  parseTitle(itemElement: HTMLElement, index: number): string | undefined {
    const img: HTMLElement | null = itemElement.querySelector(
      "div.product__image > a > img"
    );

    if (!img) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parseTitle -> img",
        severity: "HIGH",
      });
      return undefined;
    }

    const alt: string | undefined = img.getAttribute("alt");

    if (!alt) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parseTitle -> alt",
        severity: "HIGH",
      });
      return undefined;
    }

    return alt.trim();
  }
  parseUpc(itemElement: HTMLElement, index: number): string | undefined {
    const img: HTMLElement | null = itemElement.querySelector(
      "div.product__image > a > img"
    );

    if (!img) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parseUpc -> img",
        severity: "HIGH",
      });
      return undefined;
    }

    const alt: string | undefined = img.getAttribute("alt");

    if (!alt) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parseUpc -> alt",
        severity: "HIGH",
      });
      return undefined;
    }

    const title: string = alt.trim();

    const upc: string = crypto.createHash("md5").update(title).digest("hex");

    return upc;
  }
  parsePrice(itemElement: HTMLElement, index: number): number | undefined {
    const priceText: string | undefined =
      itemElement.getAttribute("data-price");

    if (!priceText) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parsePrice -> priceText",
        severity: "HIGH",
      });
      return undefined;
    }

    const price: number = parseFloat(priceText);

    if (!(price > 0)) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "price more than 0",
        result: `price not more than zero: ${price}`,
        operation: "parsePrice -> price",
        severity: "HIGH",
      });
      return undefined;
    }

    return price;
  }
  parseUrl(itemElement: HTMLElement, index: number): string | undefined {
    const anchor: HTMLElement | null = itemElement.querySelector(
      "div.product__info > h3 > a"
    );

    if (!anchor) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parseUrl -> anchor",
        severity: "HIGH",
      });
      return undefined;
    }

    const href: string | undefined = anchor.getAttribute("href");

    if (!href) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parseUrl -> href",
        severity: "HIGH",
      });
      return undefined;
    }

    return `https://www.jurawatches.co.uk${href}`;
  }
  parseImage(itemElement: HTMLElement, index: number): string | undefined {
    const img: HTMLElement | null = itemElement.querySelector(
      "div.product__image > a > img"
    );

    if (!img) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parseImage -> img",
        severity: "HIGH",
      });
      return undefined;
    }

    const src: string | undefined = img.getAttribute("data-src");

    if (!src) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parseImage -> src",
        severity: "HIGH",
      });
      return undefined;
    }

    return `https:${src}`;
  }
  parseBrand(itemElement: HTMLElement, index: number): string | undefined {
    return undefined;
  }
  parseModel(itemElement: HTMLElement, index: number): string | undefined {
    const p: HTMLElement | null = itemElement.querySelector(
      "div.product__info > p"
    );

    if (!p) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parseModel -> p",
        severity: "HIGH",
      });
      return undefined;
    }

    const model: string | undefined = p?.innerText.trim();

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
    const pageUrlSplit: string[] = this.result.pageUrl.split("&page=");
    return `${pageUrlSplit[0]}&page=${this.result.pageNumber + 1}`;
  }
  parseNextPageNumber(): number {
    return this.getConfig().currentPageNumber + 1;
  }
}
