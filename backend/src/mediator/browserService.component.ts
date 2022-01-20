import {
  Browser,
  BrowserLaunchArgumentOptions,
  Page,
  WaitForOptions,
} from "puppeteer";
import puppeteer from "puppeteer-extra";
puppeteer.use(require("puppeteer-extra-plugin-stealth")());
puppeteer.use(require("puppeteer-extra-plugin-anonymize-ua")());

export class BrowserServiceComponent {
  private browser: Browser | null;

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
    if (!this.browser)
      throw new Error("Trying to get pages from null browser!");
    const pages: Page[] = await this.browser.pages();
    if (pages.length === 0)
      throw new Error("Browser is not launched. RUN launch() first.");

    await pages[0].goto(url, options);
  }

  async getPageHtmlContent(): Promise<string> {
    if (!this.browser)
      throw new Error("Trying to get pages from null browser!");
    const pages: Page[] = await this.browser.pages();
    if (pages.length === 0)
      throw new Error("Browser is not launched. RUN launch() first.");
    return await pages[0].content();
  }

  async getPage(): Promise<Page> {
    if (!this.browser)
      throw new Error("Trying to get pages from null browser!");
    const pages: Page[] = await this.browser.pages();
    if (pages.length === 0)
      throw new Error("Browser is not launched. RUN launch() first.");
    return pages[0];
  }

  async close(): Promise<void> {
    if (this.browser) await this.browser.close();
    this.browser = null;
  }

  getBrowser(): Browser {
    if (!this.browser) throw new Error("Trying to return null browser!");
    return this.browser;
  }
}
