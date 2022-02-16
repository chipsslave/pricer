import { RequestInit } from "node-fetch";
import { JobError } from "../service/job";

export type ParsedItem = {
  title: string;
  upc: string;
  price: number;
  url: string;
  image?: string;
  brand?: string;
  model?: string;
};

export type NextPageResult = {
  pageUrl: string;
  pageNumber: number;
} | null;

export type ParserResult = {
  pageUrl: string;
  pageNumber: number;
  parsedItems: ParsedItem[];
  elementsCount: number;
  nextPage: NextPageResult;
  parserErrors: JobError[];
  parsedItemsCount: number;
  parsedItemsSuccessCount: number;
  parsedItemsFailCount: number;
};

export type ParserConfig = {
  currentPageNumber: number;
  itemElementsCountExpected: number;
  currentUrl: string;
};

export interface Parser<SC> {
  parse(): ParserResult;
  buildBody(): RequestInit | null;
  setContent(content: SC): void;
  setConfig(config: ParserConfig): void;
}

export abstract class AbstractParser<SC, C, IE> implements Parser<SC> {
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

  abstract parseTitle(itemElement: IE, index: number): string | undefined;
  abstract parseUpc(itemElement: IE, index: number): string | undefined;
  abstract parsePrice(itemElement: IE, index: number): number | undefined;
  abstract parseUrl(itemElement: IE, index: number): string | undefined;
  abstract parseImage(itemElement: IE, index: number): string | undefined;
  abstract parseBrand(itemElement: IE, index: number): string | undefined;
  abstract parseModel(itemElement: IE, index: number): string | undefined;

  abstract parseNextPageUrl(): string;
  abstract parseNextPageNumber(): number;

  parseItem(itemElement: IE, index: number): ParsedItem | null {
    const title = this.parseTitle(itemElement, index)?.trim();
    const upcString = this.parseUpc(itemElement, index)?.trim();
    const upc = upcString ? `${this.getUpcCode()}${upcString}` : undefined;
    const price = this.parsePrice(itemElement, index);
    const url = this.parseUrl(itemElement, index)?.trim();
    const image = this.parseImage(itemElement, index)?.trim();
    const brand = this.parseBrand(itemElement, index)?.trim();
    const model = this.parseModel(itemElement, index)?.trim();

    if (title && upc && url && price)
      return {
        title,
        upc,
        price,
        url,
        image,
        brand,
        model,
      };
    return null;
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
      const parsedItem: ParsedItem | null = this.parseItem(element, index);

      if (parsedItem) {
        this.result.parsedItems.push(parsedItem);
        this.result.parsedItemsSuccessCount++;
      } else {
        this.result.parsedItemsFailCount++;
      }
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
      pageUrl: this.config.currentUrl,
      pageNumber: this.config.currentPageNumber,
      elementsCount: -1,
      nextPage: null,
      parsedItems: [],
      parserErrors: [],
      parsedItemsCount: 0,
      parsedItemsSuccessCount: 0,
      parsedItemsFailCount: 0,
    };
  }
}
