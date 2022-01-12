import {
  Browser,
  BrowserLaunchArgumentOptions,
  Page,
  WaitForOptions,
} from "puppeteer";
import puppeteer from "puppeteer-extra";
puppeteer.use(require("puppeteer-extra-plugin-stealth")());
puppeteer.use(require("puppeteer-extra-plugin-anonymize-ua")());

export class BrowserClient {
  private browser: Browser;
  private lastPageContent: string;

  constructor() {}

  async launch(
    launchArgs: BrowserLaunchArgumentOptions = {
      headless: false,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    }
  ): Promise<void> {
    if (!this.browser || (await this.browser.pages()).length === 0) {
      this.browser = await puppeteer.launch(launchArgs);
    }
  }

  async goTo(
    url: string,
    options:
      | (WaitForOptions & {
          referer?: string | undefined;
        })
      | undefined = { waitUntil: ["domcontentloaded", "networkidle2"] }
  ): Promise<void> {
    const pages: Page[] = await this.browser.pages();
    if (pages.length === 0)
      throw new Error("Browser is not launched. RUN launch() first.");
    await pages[0].goto(url, options);
    this.lastPageContent = await pages[0].content();
  }

  async getPageHtmlContent(): Promise<string> {
    const pages: Page[] = await this.browser.pages();
    if (pages.length === 0)
      throw new Error("Browser is not launched. RUN launch() first.");
    return await pages[0].content();
  }

  async close(): Promise<void> {
    await this.browser.close();
  }

  getBrowser(): Browser {
    return this.browser;
  }

  getLastPageContent(): string {
    return this.lastPageContent;
  }
}
