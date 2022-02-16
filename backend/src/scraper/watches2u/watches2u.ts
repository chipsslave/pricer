import { RequestInit } from "node-fetch";
import parse, { HTMLElement } from "node-html-parser";
import { AbstractParser } from "../../parser/parser";
import crypto from "crypto";

export class Watches2UParser extends AbstractParser<
  string,
  HTMLElement,
  HTMLElement
> {
  constructor() {
    super("W2U_");
  }
  setContent(content: string): void {
    this.content = parse(content);
  }
  buildBody(): RequestInit | null {
    return null;
  }
  parseItemElements(): HTMLElement[] {
    const elements: HTMLElement[] = this.content.querySelectorAll(
      "a[class=xcomponent_products_medium_link]"
    );

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
    const container: HTMLElement | null = this.content.querySelector(
      "div[class=page_search_results_subbar_right]"
    );

    if (!container) {
      this.result.parserErrors.push({
        elementIndex: -1,
        expected: "not null",
        result: "null",
        operation: "nextPageExists -> container",
        severity: "HIGH",
      });
      return false;
    }

    const span: HTMLElement | null = container.querySelector("span");

    if (!span) {
      this.result.parserErrors.push({
        elementIndex: -1,
        expected: "not null",
        result: "null",
        operation: "nextPageExists -> span",
        severity: "HIGH",
      });
      return false;
    }

    const spanText: string = span.text;
    const spanTextSplit: string[] = spanText?.split(" ");

    if (!spanTextSplit.length) {
      this.result.parserErrors.push({
        elementIndex: -1,
        expected: "not null",
        result: "null",
        operation: "nextPageExists -> spanTextSplit",
        severity: "HIGH",
      });
      return false;
    }

    const currentPage = parseInt(spanTextSplit[1]);

    if (!(currentPage >= 0)) {
      this.result.parserErrors.push({
        elementIndex: -1,
        expected: "currentPage >= 0",
        result: `currentPage: ${currentPage}`,
        operation: "nextPageExists -> currentPage",
        severity: "HIGH",
      });
      return false;
    }

    const totalPages = parseInt(spanTextSplit[3]);

    if (!(totalPages >= 0)) {
      this.result.parserErrors.push({
        elementIndex: -1,
        expected: "currentPage >= 0",
        result: `currentPage: ${totalPages}`,
        operation: "nextPageExists -> totalPages",
        severity: "HIGH",
      });
      return false;
    }

    if (currentPage < totalPages) {
      return true;
    }

    return false;
  }
  parseTitle(itemElement: HTMLElement, index: number): string | undefined {
    const img: HTMLElement | null = itemElement.querySelector("img");

    if (!img) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: `null`,
        operation: "parseTitle -> img",
        severity: "HIGH",
      });
      return undefined;
    }

    const title: string | undefined = img.getAttribute("title");

    if (!title) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: `null`,
        operation: "parseTitle -> title",
        severity: "HIGH",
      });
      return undefined;
    }

    const titleTrimmed: string = title.trim();

    if (!titleTrimmed) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: `null`,
        operation: "parseTitle -> titleTrimmed",
        severity: "HIGH",
      });
      return undefined;
    }

    return titleTrimmed;
  }
  parseUpc(itemElement: HTMLElement, index: number): string | undefined {
    const img: HTMLElement | null = itemElement.querySelector("img");

    if (!img) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: `null`,
        operation: "parseUpc -> img",
        severity: "HIGH",
      });
      return undefined;
    }

    const title: string | undefined = img.getAttribute("title");

    if (!title) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: `null`,
        operation: "parseUpc -> title",
        severity: "HIGH",
      });
      return undefined;
    }

    const trimmedTitle: string = title.trim();

    if (!trimmedTitle) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: `null`,
        operation: "parseUpc -> trimmedTitle",
        severity: "HIGH",
      });
      return undefined;
    }

    const upc: string = crypto
      .createHash("md5")
      .update(trimmedTitle)
      .digest("hex");

    return upc;
  }
  parsePrice(itemElement: HTMLElement, index: number): number | undefined {
    const priceContainer: HTMLElement | null = itemElement.querySelector(
      "div[class=xcomponent_products_medium_price]"
    );

    if (!priceContainer) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: `null`,
        operation: "parsePrice -> priceContainer",
        severity: "HIGH",
      });
      return undefined;
    }

    const reComma = new RegExp(",", "g");
    const priceText = priceContainer.structuredText.replace(reComma, "");

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

    const containsVoucherDiscount: boolean = priceText.includes("off use");
    const pricesSplit = priceText.split("£");

    if (containsVoucherDiscount) {
      const voucherText = pricesSplit.find((priceText) =>
        priceText.includes("off use")
      );
      const indexOfVoucherText = voucherText
        ? pricesSplit.indexOf(voucherText)
        : 0;
      const price = pricesSplit[indexOfVoucherText + 1];
      return parseFloat(price);
    }
    const priceString: string = pricesSplit[1];

    if (!priceString) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: `null`,
        operation: "parsePrice -> priceString",
        severity: "HIGH",
      });
      return undefined;
    }

    const priceAsFloat = parseFloat(priceString);

    if (!(priceAsFloat > 0)) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: `null`,
        operation: "parsePrice -> priceAsFloat",
        severity: "HIGH",
      });
      return undefined;
    }

    return priceAsFloat;
  }
  parseUrl(itemElement: HTMLElement, index: number): string | undefined {
    const url = itemElement.getAttribute("href");

    if (!url) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: `null`,
        operation: "parseUrl -> url",
        severity: "HIGH",
      });
      return undefined;
    }
    return url;
  }
  parseImage(itemElement: HTMLElement, index: number): string | undefined {
    const imgContainer: HTMLElement | null = itemElement.querySelector("img");

    if (!imgContainer) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: `null`,
        operation: "parseImage -> imgContainer",
        severity: "HIGH",
      });
      return undefined;
    }

    const src: string | undefined = imgContainer.getAttribute("src");

    if (!src) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: `null`,
        operation: "parseImage -> src",
        severity: "HIGH",
      });
      return undefined;
    }

    return src;
  }
  parseBrand(itemElement: HTMLElement, index: number): string | undefined {
    const detailsContainer: HTMLElement | null = itemElement.querySelector(
      "span[class=xcomponent_products_medium_description]"
    );

    if (!detailsContainer) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: `null`,
        operation: "parseBrand -> detailsContainer",
        severity: "HIGH",
      });
      return undefined;
    }

    const span: HTMLElement | null = detailsContainer.querySelector("span");

    if (!span) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: `null`,
        operation: "parseBrand -> span",
        severity: "HIGH",
      });
      return undefined;
    }

    const brand: string = span.text;

    if (!brand) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: `null`,
        operation: "parseBrand -> brand",
        severity: "HIGH",
      });
      return undefined;
    }

    const brandTrim: string = brand.trim();

    if (!brandTrim) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: `null`,
        operation: "parseBrand -> brandTrim",
        severity: "HIGH",
      });
      return undefined;
    }

    return brandTrim;
  }
  parseModel(itemElement: HTMLElement, index: number): string | undefined {
    const brand: string | undefined = this.parseBrand(itemElement, index);

    if (!brand) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: `null`,
        operation: "parseModel -> brand",
        severity: "HIGH",
      });
      return undefined;
    }

    const detailsContainer: HTMLElement | null = itemElement.querySelector(
      "span[class=xcomponent_products_medium_description]"
    );

    if (!detailsContainer) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: `null`,
        operation: "parseModel -> detailsContainer",
        severity: "HIGH",
      });
      return undefined;
    }

    const detailsText: string = detailsContainer.structuredText;

    if (!detailsText) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: `null`,
        operation: "parseModel -> detailsText",
        severity: "HIGH",
      });
      return undefined;
    }

    const textSplit: string[] = detailsText?.split(brand);

    if (!textSplit.length) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: `null`,
        operation: "parseModel -> textSplit",
        severity: "HIGH",
      });
      return undefined;
    }

    const model: string = textSplit[0];

    if (!model) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: `null`,
        operation: "parseModel -> model",
        severity: "HIGH",
      });
      return undefined;
    }

    return model;
  }

  parseNextPageUrl(): string {
    const pageUrlSplit: string[] = this.result.pageUrl.split("page_num=");
    return `${pageUrlSplit[0]}page_num=${this.result.pageNumber + 1}`;
  }
  parseNextPageNumber(): number {
    return this.getConfig().currentPageNumber + 1;
  }
}
