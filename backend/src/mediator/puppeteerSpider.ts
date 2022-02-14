import {
  buildBrowser,
  buildHeadlessBrowser,
  PuppeteerClient,
} from "../browser/puppeteerClient";
import { BaseSpider } from "./spider";

export class PuppeteerSpider extends BaseSpider<string> {
  private headless: boolean;
  private browser: PuppeteerClient | null;

  constructor(headless: boolean) {
    super();
    this.headless = headless;
  }

  private async setupBrowser(): Promise<void> {
    if (!this.browser) {
      this.browser = this.headless
        ? await buildHeadlessBrowser()
        : await buildBrowser();
    }
  }

  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser?.close();
      this.browser = null;
    }
  }

  async fetchContent(url: string): Promise<string> {
    await this.setupBrowser();
    if (!this.browser) throw new Error("browser is not set");
    await this.browser.goTo(url);
    return await this.browser.getPageHtmlContent();
  }
}
