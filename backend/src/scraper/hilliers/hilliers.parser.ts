import {
  NodeHTMLParser,
  ParsedItem,
} from "../../mediator/parserService.component";
import { HTMLElement } from "node-html-parser";

export class HilliersParserServiceComponent extends NodeHTMLParser {
  constructor() {
    super("Hilliers Jewellers", "HILL_");
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
      upc: `${this.getUpcCode()}${element
        .querySelector("div.product")
        ?.getAttribute("id")}`,
      price: this.priceCalculator(element),
      url:
        `https://www.hillierjewellers.co.uk${element
          .querySelector("a")
          ?.getAttribute("href")}` || null,
      image:
        `https://www.hillierjewellers.co.uk${element
          .querySelector("img")
          ?.getAttribute("data-src")}` || null,
      brand: null,
      model:
        element
          .querySelector("div.product")
          ?.getAttribute("data-productreference")
          ?.toUpperCase() || null,
    };
    return item;
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
