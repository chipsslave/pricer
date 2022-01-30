import {
  NodeHTMLParser,
  ParsedItem,
} from "../../mediator/parserService.component";
import { HTMLElement } from "node-html-parser";
import crypto from "crypto";

export class Watches2uParserServiceComponent extends NodeHTMLParser {
  constructor() {
    super("Watches 2 U", "W2U_");
  }

  parseItemElements(): HTMLElement[] {
    const elements: HTMLElement[] = this.pageContentParsed.querySelectorAll(
      "a[class=xcomponent_products_medium_link]"
    );
    return elements;
  }

  nextPageAvailable(): boolean {
    const container = this.pageContentParsed.querySelector(
      "div[class=page_search_results_subbar_right]"
    );
    const span = container?.querySelector("span");
    const spanText = span?.text;
    const spanTextSplit = spanText?.split(" ");
    const currentPage = spanTextSplit ? parseInt(spanTextSplit[1]) : -1;
    const totalPages = spanTextSplit ? parseInt(spanTextSplit[3]) : -1;

    if (currentPage < totalPages) {
      return true;
    }
    return false;
  }

  parseNextPageUrl(): string {
    const pageUrlSplit: string[] = this.result.pageUrl.split("page_num=");
    return `${pageUrlSplit[0]}page_num=${this.result.pageNumber + 1}`;
  }

  parseItem(element: HTMLElement): ParsedItem {
    const item: ParsedItem = {
      title: element.querySelector("img")?.getAttribute("title") || null,
      upc: `${this.getUpcCode()}${crypto
        .createHash("md5")
        .update(element.querySelector("img")?.getAttribute("title") || "")
        .digest("hex")}`,
      price: this.priceCalculator(element),
      url: this.getUrl(element),
      image: element.querySelector("img")?.getAttribute("src") || null,
      brand: this.detailsCalculator(element).brand,
      model: this.detailsCalculator(element).model,
    };
    return item;
  }

  detailsCalculator = (
    itemElement: HTMLElement
  ): { brand: string | null; model: string | null } => {
    const detailsContainer = itemElement.querySelector(
      "span[class=xcomponent_products_medium_description]"
    );
    const detailsText = detailsContainer?.structuredText;

    const brand = detailsContainer?.querySelector("span")?.text || null;

    const model = detailsText?.split(brand || "")[0] || null;

    return {
      brand,
      model,
    };
  };

  getUrl(itemElement: HTMLElement): string | null {
    const url = itemElement.getAttribute("href");
    return url ? url : null;
  }

  priceCalculator(itemElement: HTMLElement): number | null {
    const priceContainer = itemElement.querySelector(
      "div[class=xcomponent_products_medium_price]"
    );

    if (!priceContainer) return null;
    const reComma = new RegExp(",", "g");
    const priceText = priceContainer.structuredText.replace(reComma, "");

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
    const price = pricesSplit[1];
    const priceAsFloat = parseFloat(price);
    return priceAsFloat > 0 ? priceAsFloat : null;
  }
}
