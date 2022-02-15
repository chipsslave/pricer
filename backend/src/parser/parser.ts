import { RequestInit } from "node-fetch";
import { JobErrorSeverity } from "@prisma/client";

export type ParsedItem = {
  title?: string;
  upc?: string;
  price?: number;
  url?: string;
  image?: string;
  brand?: string;
  model?: string;
};

export type NextPageResult = {
  pageUrl: string;
  pageNumber: number;
} | null;

export type JobError = {
  expected: string;
  result: string;
  severity: JobErrorSeverity;
  operation: string;
  elementIndex: number;
};

export type ParserResult = {
  parsedItems: ParsedItem[];
  elementsCount: number;
  nextPage: NextPageResult;
  parserErrors: JobError[];
  parsedItemsCount: number;
};

export type ParserConfig = {
  currentPageNumber: number;
  itemElementsCountExpected: number;
  currentUrl: string;
};

export interface Parser {
  parse(): ParserResult;
}

export abstract class AbstractParser<SC, C, IE> implements Parser {
  private config: ParserConfig;
  private upcCode: string;
  content: C;
  result: ParserResult;

  constructor(upcCode: string) {
    this.upcCode = upcCode;
  }

  abstract setContent(content: SC): void;

  abstract buildBody(): RequestInit | null;

  abstract parseItemElements(): IE[];

  abstract nextPageExists(): boolean;

  getContent(): C {
    return this.content;
  }

  abstract parseTitle(itemElement: IE, index: number): string | undefined;
  abstract parseUpc(itemElement: IE, index: number): string | undefined;
  abstract parsePrice(itemElement: IE, index: number): number | undefined;
  abstract parseUrl(itemElement: IE, index: number): string | undefined;
  abstract parseImage(itemElement: IE, index: number): string | undefined;
  abstract parseBrand(itemElement: IE, index: number): string | undefined;
  abstract parseModel(itemElement: IE, index: number): string | undefined;

  abstract parseNextPageUrl(): string;
  abstract parseNextPageNumber(): number;

  parseItem(itemElement: IE, index: number): ParsedItem {
    return {
      title: this.parseTitle(itemElement, index)?.trim(),
      upc: this.parseUpc(itemElement, index)?.trim(),
      price: this.parsePrice(itemElement, index),
      url: this.parseUrl(itemElement, index)?.trim(),
      image: this.parseImage(itemElement, index)?.trim(),
      brand: this.parseBrand(itemElement, index)?.trim(),
      model: this.parseModel(itemElement, index)?.trim(),
    };
  }

  itemSuccess(item: ParsedItem): boolean {
    if (item.price && item.title && item.upc && item.url) return true;
    return false;
  }

  getUpcCode() {
    return this.upcCode;
  }

  setConfig(config: ParserConfig): void {
    this.config = config;
  }

  getConfig(): ParserConfig {
    return this.config;
  }

  parse(): ParserResult {
    if (!this.config) throw new Error("Config is not set!");

    this.resetResult();

    const parsedElements: IE[] = this.parseItemElements();

    this.result.elementsCount = parsedElements.length;

    for (const [index, element] of parsedElements.entries()) {
      const parsedItem: ParsedItem = this.parseItem(element, index);

      if (this.itemSuccess(parsedItem))
        this.result.parsedItems.push(parsedItem);
    }

    this.result.parsedItemsCount = this.result.parsedItems.length;

    if (this.nextPageExists()) {
      this.result.nextPage = {
        pageNumber: this.parseNextPageNumber(),
        pageUrl: this.parseNextPageUrl(),
      };
    }
    return this.result;
  }

  resetResult(): void {
    this.result = {
      elementsCount: -1,
      nextPage: null,
      parsedItems: [],
      parserErrors: [],
      parsedItemsCount: 0,
    };
  }
}
