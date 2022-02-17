import { RequestInit } from "node-fetch";
import { AbstractParser } from "../../parser/parser";
import { Brand, Hit, RootHSamuel } from "../hsamuel/hsamuel.types";

export class ErnestJonesParser extends AbstractParser<
  unknown,
  RootHSamuel,
  Hit
> {
  constructor() {
    super("EJ_");
  }
  setContent(content: unknown): void {
    this.content = content as RootHSamuel;
  }
  buildBody(): RequestInit | null {
    if (!this.getConfig().body) {
      this.result.parserErrors.push({
        elementIndex: -1,
        expected: "body not null",
        result: `null`,
        operation: "buildBody",
        severity: "HIGH",
      });
      return null;
    }
    return {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:96.0) Gecko/20100101 Firefox/96.0",
        Accept: "*/*",
        "Accept-Language": "en-GB,en;q=0.5",
        "x-algolia-api-key": "b00c700f18de421743f8fe6d67c7f0c8",
        "x-algolia-application-id": "4ZMIVJGJ4Y",
        "content-type": "application/x-www-form-urlencoded",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site",
      },
      body: this.getConfig().body?.replace(
        "highlight__&page=0",
        `highlight__&page=${this.getConfig().currentPageNumber}`
      ),
      method: "POST",
    };
  }
  parseItemElements(): Hit[] {
    const elements: Hit[] = this.content.results[0].hits;

    if (elements.length == 0)
      this.result.parserErrors.push({
        elementIndex: -1,
        expected: "not empty array",
        result: "empty array",
        operation: "parseItemElements",
        severity: "HIGH",
      });

    if (elements.length < this.getConfig().itemElementsCountExpected)
      this.result.parserErrors.push({
        elementIndex: -1,
        expected: `count of ${
          this.getConfig().itemElementsCountExpected
        } elements`,
        result: `count of ${elements.length} elements`,
        operation: "parseItemElements",
        severity: "LOW",
      });

    if (elements.length > this.getConfig().itemElementsCountExpected)
      this.result.parserErrors.push({
        elementIndex: -1,
        expected: `count of ${
          this.getConfig().itemElementsCountExpected
        } elements`,
        result: `count of ${elements.length} elements`,
        operation: "parseItemElements",
        severity: "MEDIUM",
      });

    return elements;
  }
  nextPageExists(): boolean {
    return false;
  }
  parseTitle(itemElement: Hit, index: number): string | undefined {
    const title: string | undefined = itemElement.long_name;

    if (!title) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parseTitle",
        severity: "HIGH",
      });
      return undefined;
    }

    return title;
  }
  parseUpc(itemElement: Hit, index: number): string | undefined {
    const upc: number | undefined = itemElement.sku_id;

    if (!upc) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parseUpc -> upc",
        severity: "HIGH",
      });
      return undefined;
    }

    const upcString: string = upc.toString();

    if (!upcString) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parseUpc -> upcString",
        severity: "HIGH",
      });
      return undefined;
    }

    return upcString;
  }
  parsePrice(itemElement: Hit, index: number): number | undefined {
    const price: number | undefined = itemElement.current_price;

    if (!price) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parsePrice -> price",
        severity: "HIGH",
      });
      return undefined;
    }

    if (!(price > 0)) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "price should be more than 0",
        result: `price: ${price}`,
        operation: "parsePrice -> price > 0",
        severity: "HIGH",
      });
      return undefined;
    }

    return price;
  }
  parseUrl(itemElement: Hit, index: number): string | undefined {
    const urlHalf: string | undefined = itemElement.product_detail_url;

    if (!urlHalf) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parseUrl -> urlHalf",
        severity: "HIGH",
      });
      return undefined;
    }

    return `https://www.ernestjones.co.uk${urlHalf}`;
  }
  parseImage(itemElement: Hit, index: number): string | undefined {
    const image: string | undefined = itemElement.image;

    if (!image) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parseImage -> image",
        severity: "HIGH",
      });
      return undefined;
    }

    return image;
  }
  parseBrand(itemElement: Hit, index: number): string | undefined {
    const brandObject: Brand | undefined | null = itemElement.brand;

    if (!brandObject) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parseBrand -> brandObject",
        severity: "MEDIUM",
      });
      return undefined;
    }

    const brand0: string | undefined = brandObject.lvl0;
    const brand1: string | undefined = brandObject.lvl1;
    const brand2: string | undefined = brandObject.lvl2;

    const brand: string | undefined = brand0 || brand1 || brand2;

    if (!brand) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parseBrand -> brand",
        severity: "MEDIUM",
      });
      return undefined;
    }

    return brand;
  }
  parseModel(itemElement: Hit, index: number): string | undefined {
    const model: string | undefined = itemElement.supplier_model_number;

    if (!model) {
      this.result.parserErrors.push({
        elementIndex: index,
        expected: "not null",
        result: "null",
        operation: "parseModel -> model",
        severity: "MEDIUM",
      });
      return undefined;
    }

    return model;
  }
  parseNextPageUrl(): string {
    throw new Error("Method not implemented.");
  }
  parseNextPageNumber(): number {
    throw new Error("Method not implemented.");
  }
}
