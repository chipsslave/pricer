import { JsonParser, ParsedItem } from "../../parser/parserService.component";
import { Hit, RootHSamuel } from "./hsamuel.types";
import { RequestInit } from "node-fetch";

export class HSamuelParser extends JsonParser<unknown, RootHSamuel, Hit> {
  constructor() {
    super("HS_");
  }

  buildBody(): RequestInit | null {
    this.body = {
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
      body: this.result.page.body?.replace(
        "highlight__&page=0",
        `highlight__&page=${this.result.pageNumber}`
      ),
      method: "POST",
    };
    return this.body;
  }

  parseItemElements(): Hit[] {
    return this.pageContentParsed.results[0].hits;
  }
  nextPageAvailable(): boolean {
    return false;
  }
  parseNextPageUrl(): string {
    throw new Error("Method not implemented.");
  }
  parseItem(element: Hit): ParsedItem {
    const parsedItem: ParsedItem = {
      price: element.current_price || null,
      title: element.long_name || null,
      upc: element.sku_id ? `${this.getUpcCode()}${element.sku_id}` : null,
      url: `https://www.hsamuel.co.uk${element.product_detail_url}`,
      image: element.image || undefined,
      brand:
        element.brand?.lvl0 ||
        element.brand?.lvl1 ||
        element.brand?.lvl2 ||
        undefined,
      model: element.supplier_model_number || undefined,
    };

    return parsedItem;
  }
}
