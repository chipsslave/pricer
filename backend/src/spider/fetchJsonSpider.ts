import { FetchClient } from "../browser/fetchClient";
import { BaseSpider } from "./spider";

export class FetchJsonSpider extends BaseSpider<unknown> {
  private browser: FetchClient = new FetchClient();

  closeBrowser(): void {}

  async fetchContent(url: string, body?: unknown): Promise<unknown> {
    return await this.browser.fetchJson(url, body);
  }
}
