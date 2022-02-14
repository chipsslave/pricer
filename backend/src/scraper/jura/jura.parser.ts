import {
  NodeHTMLParser,
  ParsedItem,
} from "../../mediator/parserService.component";
import { HTMLElement } from "node-html-parser";
import crypto from "crypto";

export class JuraParserServiceComponent extends NodeHTMLParser {
  constructor() {
    super("JURA_");
  }

  parseItemElements(): HTMLElement[] {
    const elements: HTMLElement[] =
      this.pageContentParsed.querySelectorAll("div.product");
    return elements;
  }

  nextPageAvailable(): boolean {
    const items = this.pageContentParsed.querySelectorAll("div.product");
    if (items.length < 30) {
      return false;
    }
    return true;
  }

  parseNextPageUrl(): string {
    const pageUrlSplit: string[] = this.result.pageUrl.split("&page=");
    return `${pageUrlSplit[0]}&page=${this.result.pageNumber + 1}`;
  }

  parseItem(element: HTMLElement): ParsedItem {
    const item: ParsedItem = {
      title:
        element
          .querySelector("div.product__image > a > img")
          ?.getAttribute("alt")
          ?.trim() || null,
      upc: `${this.getUpcCode()}${crypto
        .createHash("md5")
        .update(
          element
            .querySelector("div.product__image > a > img")
            ?.getAttribute("alt")
            ?.trim() || ""
        )
        .digest("hex")}`,
      price: this.priceCalculator(element),
      url: this.getUrl(element),
      image:
        "https:" +
          element
            .querySelector("div.product__image > a > img")
            ?.getAttribute("data-src") || undefined,
      brand: this.detailsCalculator(element).brand,
      model: this.detailsCalculator(element).model,
    };
    return item;
  }

  detailsCalculator = (
    itemElement: HTMLElement
  ): { brand: string | undefined; model: string | undefined } => {
    const brand = undefined;

    const model =
      itemElement.querySelector("div.product__info > p")?.innerText.trim() ||
      undefined;

    return {
      brand,
      model,
    };
  };

  getUrl(itemElement: HTMLElement): string | null {
    const url = itemElement
      .querySelector("div.product__info > h3 > a")
      ?.getAttribute("href");

    return url ? `https://www.jurawatches.co.uk${url}` : null;
  }

  priceCalculator(itemElement: HTMLElement): number | null {
    const priceText = itemElement.getAttribute("data-price");
    const price = priceText && parseFloat(priceText);

    return price || null;
  }
}
