import { Page } from "@prisma/client";
import {
  ParsedItem,
  ParserResult,
} from "../../mediator/parserService.component";
import { Hit, RootHSamuel } from "./hsamuel.types";
const crypto = require("crypto");

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
        image: element.image || undefined,
        brand:
          element.brand?.lvl0 ||
          element.brand?.lvl1 ||
          element.brand?.lvl2 ||
          undefined,
        model: element.supplier_model_number || undefined,
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
    return false;
  }
}
