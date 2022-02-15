import {
  NodeHTMLParser,
  ParsedItem,
} from "../../parser/parserService.component";
import { HTMLElement } from "node-html-parser";

export class HilliersParser extends NodeHTMLParser {
  constructor() {
    super("HILL_");
  }

  buildBody(): unknown {
    return null;
  }

  parseItemElements(): HTMLElement[] {
    const elements: HTMLElement[] =
      this.pageContentParsed.querySelectorAll("li.col");
    return elements;
  }

  nextPageAvailable(): boolean {
    const items = this.pageContentParsed.querySelectorAll("li.col");
    if (items.length < 60) {
      return false;
    }
    return true;
  }

  parseNextPageUrl(): string {
    const pageUrlSplit: string[] = this.result.pageUrl.split("&page=");
    return `${pageUrlSplit[0]}&page=${
      this.result.pageNumber + 1
    }&transport=html`;
  }

  parseItem(element: HTMLElement): ParsedItem {
    const item: ParsedItem = {
      title: element.querySelector("a")?.getAttribute("title")?.trim() || null,
      upc: this.upcCalculator(element),
      price: this.priceCalculator(element),
      url:
        `https://www.hillierjewellers.co.uk${element
          .querySelector("a")
          ?.getAttribute("href")}` || null,
      image:
        `https://www.hillierjewellers.co.uk${element
          .querySelector("img")
          ?.getAttribute("data-src")}` || undefined,
      brand: undefined,
      model:
        element
          .querySelector("div.product")
          ?.getAttribute("data-productreference")
          ?.toUpperCase() || undefined,
    };
    return item;
  }

  upcCalculator(itemElement: HTMLElement): string | null {
    const product_code_random = itemElement
      .querySelector("div.product")
      ?.getAttribute("id");

    if (!product_code_random) return null;

    const productCodeSplit: string[] = product_code_random.split("_");

    if (productCodeSplit.length !== 3) return null;

    const upc: string = productCodeSplit[1];

    return `${this.getUpcCode()}${upc}`;
  }

  priceCalculator(itemElement: HTMLElement): number | null {
    const priceElement = itemElement.querySelector(
      "div.product__details__prices"
    );
    const priceText = priceElement?.structuredText;

    if (!priceText) return null;

    const regx = new RegExp(",", "g");
    const cleanText = priceText.replace(regx, "");

    const textSplit: string[] = cleanText.split("£");

    return parseFloat(textSplit[1]);
  }
}
