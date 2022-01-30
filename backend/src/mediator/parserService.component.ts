import parse, { HTMLElement } from "node-html-parser";
import { Page } from "@prisma/client";
import { JobError } from "./jobService.component";
const crypto = require("crypto");

export type ParsedItem = {
  title: string | null;
  upc: string | null;
  price: number | null;
  url: string | null;
  image?: string | null;
  brand?: string | null;
  model?: string | null;
};

export type ParsedElementItem = {
  elementHash: string;
  elementIndex: number;
  item: ParsedItem;
  success: boolean;
};

export type NextPageResult = {
  pageUrl: string;
  pageNumber: number;
} | null;

export type ParserResult = {
  page: Page;
  pageUrl: string;
  pageNumber: number;
  parsedItems: ParsedElementItem[];
  elementsCount: number;
  nextPage: NextPageResult;
  parserErrors: JobError[];
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
  private upcCode: string;
  private pageContent: string;
  pageContentParsed: T;
  result: ParserResult;

  constructor(name: string, upcCode: string) {
    this.name = name;
    this.upcCode = upcCode;
  }
  parse(): ParserResult {
    throw new Error("parse() Method not implemented.");
  }

  getPageContent(): string {
    return this.pageContent;
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
      nextPage: null,
      parsedItems: [],
      parserErrors: [],
    };
  }

  itemSuccess(item: ParsedItem): boolean {
    if (item.price && item.title && item.upc && item.url) return true;
    return false;
  }

  getUpcCode() {
    return this.upcCode;
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
    this.result.elementsCount = parsedElements.length;
    for (const [index, element] of parsedElements.entries()) {
      const parsedItem: ParsedItem = this.parseItem(element);
      this.result.parsedItems.push({
        elementHash: crypto
          .createHash("md5")
          .update(element.toString())
          .digest("hex"),
        elementIndex: index,
        item: parsedItem,
        success: this.itemSuccess(parsedItem),
      });
    }

    if (this.nextPageAvailable()) {
      this.result.nextPage = {
        pageNumber: this.result.pageNumber + 1,
        pageUrl: this.parseNextPageUrl(),
      };
    }
    return this.result;
  }

  abstract parseItemElements(): HTMLElement[];
  abstract nextPageAvailable(): boolean;
  abstract parseNextPageUrl(): string;
  abstract parseItem(element: HTMLElement): ParsedItem;
}
