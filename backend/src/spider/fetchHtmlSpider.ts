import { FetchHtmlClient } from "../browser/fetchClient";
import { RequestInit } from "node-fetch";
import { BaseSpider } from "./spider";

export class FetchHtmlSpider extends BaseSpider<string> {
  private browser: FetchHtmlClient = new FetchHtmlClient();

  closeBrowser(): void {}

  async fetchContent(url: string, body?: RequestInit): Promise<string> {
    return await this.browser.getContent(url, body);
  }
}
