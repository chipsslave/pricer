import {
  Browser,
  BrowserLaunchArgumentOptions,
  Page,
  WaitForOptions,
} from "puppeteer";
import puppeteer from "puppeteer-extra";
import { DeepError, isError, PuppeteerErrorMessages } from "../error";
import { Client } from "./client";
puppeteer.use(require("puppeteer-extra-plugin-stealth")());
puppeteer.use(require("puppeteer-extra-plugin-anonymize-ua")());

export class PuppeteerClient implements Client<string, null> {
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
  ): Promise<void | DeepError<null>> {
    const healthCheck: Page | DeepError<null> = await this.checkBrowserHealth();

    if (isError(healthCheck)) {
      return healthCheck;
    }

    await healthCheck.goto(url, options);
  }

  async getContent(): Promise<string | DeepError<null>> {
    const healthCheck: Page | DeepError<null> = await this.checkBrowserHealth();

    if (isError(healthCheck)) {
      return healthCheck;
    }
    return await healthCheck.content();
  }

  async getPage(): Promise<Page | DeepError<null>> {
    const healthCheck: Page | DeepError<null> = await this.checkBrowserHealth();

    if (isError(healthCheck)) {
      return healthCheck;
    }
    return healthCheck;
  }

  async close(): Promise<void> {
    if (this.browser) await this.browser.close();
    this.browser = null;
  }

  async checkBrowserHealth(): Promise<Page | DeepError<null>> {
    // TODO improve this to go through all open pages.
    if (!this.browser)
      return {
        message: PuppeteerErrorMessages.BROWSER_NULL,
        resolution: "Start browser instance",
      };
    const pages: Page[] = await this.browser.pages();
    if (pages.length === 0)
      return {
        message: PuppeteerErrorMessages.NO_PAGES_FOUND,
        resolution: "Create page on browser instance.",
      };
    if (pages[0].isClosed())
      return {
        message: PuppeteerErrorMessages.FIRST_PAGE_CLOSED,
        resolution: "Try checking other pages.",
      };
    return pages[0];
  }
}

export async function buildHeadlessBrowser(): Promise<PuppeteerClient> {
  const browser = new PuppeteerClient();
  await browser.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  return browser;
}

export async function buildBrowser(): Promise<PuppeteerClient> {
  const browser = new PuppeteerClient();
  await browser.launch();
  return browser;
}
