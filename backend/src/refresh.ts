import moment from "moment";
import { HTMLElement, parse } from "node-html-parser";
import { Browser, HTTPResponse, Page } from "puppeteer";
import puppeteer from "puppeteer-extra";
import { StorePage } from "./service/page.service";
puppeteer.use(require("puppeteer-extra-plugin-stealth")());
puppeteer.use(require("puppeteer-extra-plugin-anonymize-ua")());

type UsernameCheckerServiceType = {
  (parse: string): void;
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
}
