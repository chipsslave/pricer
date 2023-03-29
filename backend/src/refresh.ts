import moment, { Moment } from "moment";
import { HTMLElement, parse } from "node-html-parser";
import { Browser, HTTPResponse, Page } from "puppeteer";
import puppeteer from "puppeteer-extra";
import { StorePage } from "./service/page.service";
puppeteer.use(require("puppeteer-extra-plugin-stealth")());
puppeteer.use(require("puppeteer-extra-plugin-anonymize-ua")());

type UsernameCheckerServiceType = {
  [key: string]: {
    url: string;
  };
};

export const UsernameCheckerServices: UsernameCheckerServiceType = {
  about: {
    url: "https://about.me/{{ username }}",
  },
};

// TODO logging based on configuration
export async function main(storePage: StorePage) {
  const startedAt: Date = moment().toDate();
  let browser: Browser | undefined;

  try {
    const browser: Browser = await puppeteer.launch({
      headless: false,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page: Page = (await browser.pages())[0];

    const response: HTTPResponse | null = await page.goto(storePage.url);

    if (!response) {
      console.log(`Response for ${storePage.url} is null!`);
      return;
    }

    if (!response.ok()) {
      console.log(
        `Response code for ${storePage.url} is not OK! -> ${response.statusText}`
      );
      return;
    }

    const content: string = await page.content();

    const parsedContent: HTMLElement = parse(content);

    console.log(parsedContent);
  } catch (e) {
    console.log(e);
  } finally {
    await browser?.close();
    const finishedAt: Moment = moment();
    console.log(
      `Job Started at ${startedAt} and finished ${finishedAt.toDate()}`
    );
    const timeTaken = moment.duration(finishedAt.diff(startedAt)).humanize();
    console.log(`Time taken: ${timeTaken}`);
  }
}
