import { ParsedElementItem } from "./../main";
import { BaseSpiderComponent } from "./component";
import parse, { HTMLElement } from "node-html-parser";
const crypto = require("crypto");

export interface Parser {
  parseItemElements(pageContent: string): void;
  checkNextPageAvailable(pageHtml: string, currentPageNumber: number): void;
  parseNextPageUrl(pageUrl: string, currentPageNumber: number): void;
  parseItem(element: string, elementIndex: number): void;
}

export class ArgosParserServiceComponent
  extends BaseSpiderComponent
  implements Parser
{
  parseItemElements(pageContent: string): void {
    const contentAsElement: HTMLElement = parse(pageContent);
    const elements: HTMLElement[] = contentAsElement.querySelectorAll(
      "div[class^=ProductCardstyles__Wrapper-]"
    );
    const elementsToStrings: string[] = elements.map((e) => e.toString());
    this.spider.onParsedItemElements(elementsToStrings);
  }
  checkNextPageAvailable(pageHtml: string, currentPageNumber: number): void {
    throw new Error("Method not implemented.");
  }
  parseNextPageUrl(pageUrl: string, currentPageNumber: number): void {
    throw new Error("Method not implemented.");
  }

  parseItem(element: string, elementIndex: number): void {
    const htmlElement: HTMLElement = parse(element);
    const item: ParsedElementItem = {
      element,
      elementHash: crypto
        .createHash("md5")
        .update(element.toString())
        .digest("hex"),
      elementIndex,
      item: {
        title:
          htmlElement.querySelector("a[class*=Title]")?.text.trim() || null,
        upc: htmlElement.getAttribute("data-product-id")
          ? `A_${htmlElement.getAttribute("data-product-id")?.trim()}`
          : null,
        price:
          Number(
            htmlElement
              .querySelector("div[class*=PriceText]")
              ?.text?.trim()
              .replace(/[^0-9.-]+/g, "")
          ) || null,
        url: htmlElement.getAttribute("data-product-id")
          ? `https://www.argos.co.uk/product/${htmlElement
              .getAttribute("data-product-id")
              ?.trim()}`
          : null,
      },
    };

    if (item.item.title && item.item.upc && item.item.price && item.item.url) {
      this.spider.onItemParsedSuccessfully(item);
    } else {
      this.spider.onItemParsedUnsuccessfully(item);
    }
  }
}
