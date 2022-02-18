import { RequestInit } from "node-fetch";
import parse, { HTMLElement } from "node-html-parser";
import { AbstractParser } from "../../parser/parser";

export class HilliersParser extends AbstractParser<
  string,
  HTMLElement,
  HTMLElement
> {
  constructor() {
    super("HILL_");
  }
  setContent(content: string): void {
    this.content = parse(content);
  }
  buildBody(): RequestInit | null {
    return null;
  }
  parseItemElements(): HTMLElement[] {
    const elements: HTMLElement[] = this.content.querySelectorAll("li.col");

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
    const items = this.content.querySelectorAll("li.col");
    if (items.length < this.getConfig().itemElementsCountExpected) {
      return false;
    }
    return true;
  }
  parseTitle(itemElement: HTMLElement, index: number): string | undefined {
    const title: string | undefined = itemElement
      .querySelector("a")
      ?.getAttribute("title")
      ?.trim();

    if (!title) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parseTitle",
        severity: "HIGH",
      });
      return undefined;
    }

    return title;
  }
  parseUpc(itemElement: HTMLElement, index: number): string | undefined {
    const product_code_random = itemElement
      .querySelector("div.product")
      ?.getAttribute("id");

    if (!product_code_random) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parseUpc -> product_code_random",
        severity: "HIGH",
      });
      return undefined;
    }

    const productCodeSplit: string[] = product_code_random.split("_");

    if (productCodeSplit.length !== 3) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "length 3",
        result: `length ${productCodeSplit.length}`,
        operation: "parseUpc -> productCodeSplit",
        severity: "HIGH",
      });
      return undefined;
    }

    const upc: string = productCodeSplit[1];

    return upc;
  }
  parsePrice(itemElement: HTMLElement, index: number): number | undefined {
    const priceElement = itemElement.querySelector(
      "div.product__details__prices"
    );

    if (!priceElement) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: `null`,
        operation: "parsePrice -> priceElement",
        severity: "HIGH",
      });
      return undefined;
    }

    const priceText = priceElement?.structuredText;

    if (!priceText) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: `null`,
        operation: "parsePrice -> priceText",
        severity: "HIGH",
      });
      return undefined;
    }

    const regx = new RegExp(",", "g");
    const cleanText = priceText.replace(regx, "");

    const textSplit: string[] = cleanText.split("£");

    const price: number = parseFloat(textSplit[1]);

    if (price <= 0) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: `null`,
        operation: "parsePrice -> priceText",
        severity: "HIGH",
      });
      return undefined;
    }

    return price;
  }
  parseUrl(itemElement: HTMLElement, index: number): string | undefined {
    const aElement: HTMLElement | null = itemElement.querySelector("a");

    if (!aElement) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: `null`,
        operation: "parseUrl -> aElement",
        severity: "HIGH",
      });
      return undefined;
    }

    const hrefAttribute: string | undefined = aElement.getAttribute("href");

    if (!hrefAttribute) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: `null`,
        operation: "parseUrl -> hrefAttribute",
        severity: "HIGH",
      });
      return undefined;
    }

    return `https://www.hillierjewellers.co.uk${hrefAttribute}`;
  }
  parseImage(itemElement: HTMLElement, index: number): string | undefined {
    const imgElement: HTMLElement | null = itemElement.querySelector("img");

    if (!imgElement) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: `null`,
        operation: "parseImage -> imgElement",
        severity: "HIGH",
      });
      return undefined;
    }

    const datasrcAttribute: string | undefined =
      imgElement.getAttribute("data-src");

    if (!datasrcAttribute) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: `null`,
        operation: "parseImage -> datasrcAttribute",
        severity: "HIGH",
      });
      return undefined;
    }

    return `https://www.hillierjewellers.co.uk${datasrcAttribute}`;
  }
  parseBrand(itemElement: HTMLElement, index: number): string | undefined {
    return undefined;
  }
  parseModel(itemElement: HTMLElement, index: number): string | undefined {
    const div: HTMLElement | null = itemElement.querySelector("div.product");

    if (!div) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: `null`,
        operation: "parseModel -> div",
        severity: "HIGH",
      });
      return undefined;
    }

    const model = div.getAttribute("data-productreference");

    if (!model) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: `null`,
        operation: "parseModel -> dataAttribute",
        severity: "HIGH",
      });
      return undefined;
    }

    return model.toUpperCase();
  }
  parseNextPageUrl(): string {
    const pageUrlSplit: string[] = this.result.pageUrl.split("&page=");
    return `${pageUrlSplit[0]}&page=${
      this.result.pageNumber + 1
    }&transport=html`;
  }
  parseNextPageNumber(): number {
    return this.getConfig().currentPageNumber + 1;
  }
}
