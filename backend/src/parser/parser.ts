import { JobError } from "../service/jobService.component";
import { Page } from "@prisma/client";
import { RequestInit } from "node-fetch";

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
  parse(): ParserResult;
  buildBody(): RequestInit;
}

export abstract class AbstractParser<T, IS> implements Parser<T> {
  private upcCode: string;
  private content: T;

  constructor(upcCode: string) {
    this.upcCode = upcCode;
  }

  abstract buildBody(): RequestInit;

  abstract parseItemElements(): IS;

  setContent(content: T): void {
    this.content = content;
  }

  itemSuccess(item: ParsedItem): boolean {
    if (item.price && item.title && item.upc && item.url) return true;
    return false;
  }

  getUpcCode() {
    return this.upcCode;
  }

  parse(): ParserResult {}
}

// class CC extends AbstractParser<string> {}
