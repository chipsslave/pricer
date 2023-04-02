import moment, { Moment } from "moment";
import { HTMLElement, parse } from "node-html-parser";
import { Browser, HTTPResponse, Page } from "puppeteer";
import puppeteer from "puppeteer-extra";
import { PricerLogger, PrismaLogger } from "./logger/logger";
import { NewArgosParser, NewParser } from "./parser/newParser";
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
  let errorCaught = false;

  const logger: PricerLogger = new PrismaLogger(storePage);

  try {
    browser = await puppeteer.launch({
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

    const newParser: NewParser<HTMLElement> = new NewArgosParser(
      parsedContent,
      storePage,
      logger
    );

    // parse if next page is available
    const nextPageExists: boolean = newParser.nextPageExists();
    logger.log(`next page exists -> ${nextPageExists}`);
    // parse a list of items

    // parse individual items
    // if item is correctly parsed place it in list
    // if item is incorrectly parsed place it in list

    // console.log(parsedContent);
  } catch (e) {
    console.log(e);
    errorCaught = true;
  } finally {
    if (errorCaught) {
      // increase attempts
    } else {
      // set attempts to 0
      // update page updatedAt field to current time
    }
    await browser?.close();
    const finishedAt: Moment = moment();
    logger.log(
      `Job Started at ${startedAt} and finished ${finishedAt.toDate()}`
    );
    const timeTaken = moment.duration(finishedAt.diff(startedAt)).humanize();
    logger.log(`Time taken: ${timeTaken}`);
  }
}
