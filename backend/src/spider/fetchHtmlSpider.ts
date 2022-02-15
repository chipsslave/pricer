import { FetchHtmlClient } from "../browser/fetchClient";
import { BaseSpider } from "./spider";
import { RequestInit } from "node-fetch";

export class FetchHtmlSpider extends BaseSpider<string> {
  private browser: FetchHtmlClient = new FetchHtmlClient();

  closeBrowser(): void {}

  async fetchContent(url: string, body?: RequestInit): Promise<string> {
    return await this.browser.getContent(url, body);
  }
}
