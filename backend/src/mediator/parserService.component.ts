import parse, { HTMLElement } from "node-html-parser";
import { Page } from "@prisma/client";
const crypto = require("crypto");

export type ParsedItem = {
  title: string | null;
  upc: string | null;
  price: number | null;
  url: string | null;
};

export type ParsedElementItem = {
  elementHash: string;
  elementIndex: number;
  item: ParsedItem;
};

export type ParserResult = {
  page: Page;
  pageUrl: string;
  pageNumber: number;
  parsedItems: ParsedElementItem[];
  elementsCount: number;
  nextPageAvailable: boolean;
  nextPageUrl: string | null;
};

export interface Parser {
  canParse(name: string): boolean;
  setup(
    page: Page,
    pageContent: string,
    pageUrl: string,
    pageNumber: number
  ): void;
  parse(): ParserResult;
}

export abstract class AbstractParser<T> implements Parser {
  private name: string;
  private pageContent: string;
  pageContentParsed: T;
  result: ParserResult;

  constructor(name: string) {
    this.name = name;
  }
  parse(): ParserResult {
    throw new Error("Method not implemented.");
  }

  canParse(name: string): boolean {
    if (this.name === name) {
      return true;
    }
    return false;
  }

  setup(page: Page, pageContent: string, pageUrl: string, pageNumber: number) {
    this.pageContent = pageContent;
    this.result = {
      page,
      pageUrl,
      pageNumber,
      elementsCount: 0,
      nextPageAvailable: false,
      nextPageUrl: null,
      parsedItems: [],
    };
  }
}

export abstract class NodeHTMLParser extends AbstractParser<HTMLElement> {
  setup(
    page: Page,
    pageContent: string,
    pageUrl: string,
    pageNumber: number
  ): void {
    super.setup(page, pageContent, pageUrl, pageNumber);
    this.pageContentParsed = parse(pageContent);
  }

  parse(): ParserResult {
    const parsedElements: HTMLElement[] = this.parseItemElements();
    for (const [index, element] of parsedElements.entries()) {
      const parsedItem: ParsedItem = this.parseItem(element);
      this.result.parsedItems.push({
        elementHash: crypto
          .createHash("md5")
          .update(element.toString())
          .digest("hex"),
        elementIndex: index,
        item: parsedItem,
      });
    }

    if (this.nextPageAvailable()) {
      this.result.nextPageUrl = this.parseNextPageUrl();
      this.result.nextPageAvailable = true;
    }
    return this.result;
  }

  abstract parseItemElements(): HTMLElement[];
  abstract nextPageAvailable(): boolean;
  abstract parseNextPageUrl(): string;
  abstract parseItem(element: HTMLElement): ParsedItem;
}

export class ArgosParserServiceComponent extends NodeHTMLParser {
  parseItemElements(): HTMLElement[] {
    const elements: HTMLElement[] = this.pageContentParsed.querySelectorAll(
      "div[class^=ProductCardstyles__Wrapper-]"
    );
    return elements;
  }
  nextPageAvailable(): boolean {
    throw new Error("Method not implemented.");
  }
  parseNextPageUrl(): string {
    throw new Error("Method not implemented.");
  }

  parseItem(element: HTMLElement): ParsedItem {
    const item: ParsedItem = {
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
    return item;
  }
}
