import { FetchHtmlClient } from "../browser/fetchClient";
import { RequestInit } from "node-fetch";
import { NewBaseSpider } from "./newSpider";

export class FetchHtmlSpider extends NewBaseSpider<string> {
  private browser: FetchHtmlClient = new FetchHtmlClient();

  closeBrowser(): void {}

  async fetchContent(url: string, body?: RequestInit): Promise<string> {
    return await this.browser.getContent(url, body);
  }
}
