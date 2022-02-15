import { FetchJsonClient } from "../browser/fetchClient";
import { BaseSpider } from "./spider";
import { RequestInit } from "node-fetch";

export class FetchJsonSpider extends BaseSpider<unknown> {
  private browser: FetchJsonClient = new FetchJsonClient();

  closeBrowser(): void {}

  async fetchContent(url: string, body?: RequestInit): Promise<unknown> {
    return await this.browser.getContent(url, body);
  }
}
