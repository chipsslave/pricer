import { FetchClient } from "../browser/fetchClient";
import { BaseSpider } from "./spider";

export class FetchHtmlSpider extends BaseSpider<string> {
  private browser: FetchClient = new FetchClient();

  closeBrowser(): void {}

  async fetchContent(url: string, body?: unknown): Promise<string> {
    return await this.browser.fetchHtml(url, body);
  }
}
