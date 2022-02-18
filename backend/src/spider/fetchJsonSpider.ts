import { FetchJsonClient } from "../browser/fetchClient";
import { RequestInit } from "node-fetch";
import { BaseSpider } from "./spider";

export class FetchJsonSpider extends BaseSpider<unknown> {
  private browser: FetchJsonClient = new FetchJsonClient();

  closeBrowser(): void {}

  async fetchContent(url: string, body?: RequestInit): Promise<unknown> {
    return await this.browser.getContent(url, body);
  }
}
