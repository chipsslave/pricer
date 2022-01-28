import { Hit, RootHSamuel } from "./hs.types";
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

export class ArgosParserServiceComponent extends NodeHTMLParser {
  constructor() {
    super("Argos", "A_");
  }

  parseItemElements(): HTMLElement[] {
    const elements: HTMLElement[] = this.pageContentParsed.querySelectorAll(
      "div[class^=ProductCardstyles__Wrapper-]"
    );
    return elements;
  }
  nextPageAvailable(): boolean {
    const resultsCountSpan: HTMLElement | null =
      this.pageContentParsed.querySelector("span[class^=styles__ResultsCount]");

    if (
      !resultsCountSpan &&
      this.result.pageNumber > this.result.page.pageStartsAt
    )
      this.result.parserErrors.push({
        expected: "resultsCountSpan should not return null",
        result: "resultsCountSpan should not returned null",
        severity: "HIGH",
        operation: "Checking if next page is available.",
      });
    const resultsCount: string =
      resultsCountSpan?.getAttribute("data-search-results") ||
      this.result.page.itemsPerPage.toString();
    const count: number = parseInt(resultsCount);
    const totalPages = Math.ceil(count / this.result.page.itemsPerPage);
    if (this.result.pageNumber < totalPages) {
      return true;
    }
    return false;
  }
  parseNextPageUrl(): string {
    const pageUrlSplit: string[] = this.result.pageUrl.split("page:");
    return `${pageUrlSplit[0]}page:${this.result.pageNumber + 1}/`;
  }

  parseItem(element: HTMLElement): ParsedItem {
    const item: ParsedItem = {
      title: element.querySelector("a[class*=Title]")?.text.trim() || null,
      upc: element.getAttribute("data-product-id")
        ? `${this.getUpcCode()}${element
            .getAttribute("data-product-id")
            ?.trim()}`
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

export class HSamuelParserServiceComponent {
  pageContentParsed: RootHSamuel;
  upcCode: string = "HS_";
  result: ParserResult;

  setup(
    page: Page,
    pageContent: RootHSamuel,
    pageUrl: string,
    pageNumber: number
  ): void {
    this.pageContentParsed = pageContent;
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

  parse(): ParserResult {
    const items: Hit[] = this.pageContentParsed.results[0].hits;
    this.result.elementsCount = items.length;

    for (const [index, element] of items.entries()) {
      const parsedItem: ParsedItem = {
        price: element.current_price || null,
        title: element.long_name || null,
        upc: element.sku_id ? `${this.upcCode}${element.sku_id}` : null,
        url: `https://www.hsamuel.co.uk${element.product_detail_url}`,
        image: element.image || null,
        brand:
          element.brand?.lvl0 ||
          element.brand?.lvl1 ||
          element.brand?.lvl2 ||
          null,
        model: element.supplier_model_number || null,
      };
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
        pageUrl: "",
      };
    }
    return this.result;
  }

  itemSuccess(item: ParsedItem): boolean {
    if (item.price && item.title && item.upc && item.url) return true;
    return false;
  }

  nextPageAvailable(): boolean {
    // if (
    //   this.pageContentParsed.results[0].page !== undefined &&
    //   this.pageContentParsed.results[0].nbPages !== undefined
    // )
    //   return (
    //     this.pageContentParsed.results[0].page <
    //     this.pageContentParsed.results[0].nbPages
    //   );
    return false;
  }
}
