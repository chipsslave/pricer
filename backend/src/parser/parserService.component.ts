import parse, { HTMLElement } from "node-html-parser";
import { Page } from "@prisma/client";
import { JobError } from "../service/jobService.component";
const crypto = require("crypto");

export type ParsedItem = {
  title: string | null;
  upc: string | null;
  price: number | null;
  url: string | null;
  image?: string;
  brand?: string;
  model?: string;
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

export interface Parser<T> {
  setup(page: Page, pageUrl: string, pageNumber: number): void;
  parse(pageContent: T): ParserResult;
  buildBody(): unknown;
}

export abstract class AbstractParser<T, PP> implements Parser<T> {
  private upcCode: string;
  private pageContent: T;
  pageContentParsed: PP;
  result: ParserResult;

  constructor(upcCode: string) {
    this.upcCode = upcCode;
  }

  abstract parse(pageContent: T): ParserResult;

  getPageContent(): T {
    return this.pageContent;
  }

  setup(page: Page, pageUrl: string, pageNumber: number) {
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

  abstract buildBody(): unknown;
}

export abstract class NodeHTMLParser extends AbstractParser<
  string,
  HTMLElement
> {
  setup(page: Page, pageUrl: string, pageNumber: number): void {
    super.setup(page, pageUrl, pageNumber);
  }

  parse(pageContent: string): ParserResult {
    this.pageContentParsed = parse(pageContent);
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

export abstract class JsonParser<T, PP, I> extends AbstractParser<T, PP> {
  body: unknown;

  constructor(upcCode: string) {
    super(upcCode);
  }

  setup(page: Page, pageUrl: string, pageNumber: number): void {
    super.setup(page, pageUrl, pageNumber);
  }

  parse(pageContent: T): ParserResult {
    this.pageContentParsed = pageContent as unknown as PP;
    const parsedElements: I[] = this.parseItemElements();
    this.result.elementsCount = parsedElements.length;
    for (const [index, element] of parsedElements.entries()) {
      const parsedItem: ParsedItem = this.parseItem(element);
      this.result.parsedItems.push({
        elementHash: crypto.createHash("md5").update("").digest("hex"),
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

  abstract parseItemElements(): I[];
  abstract nextPageAvailable(): boolean;
  abstract parseNextPageUrl(): string;
  abstract parseItem(element: I): ParsedItem;
}
