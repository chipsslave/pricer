import { Page, ReportErrorSeverity, Store } from "@prisma/client";
import { prisma } from "./prisma";
import moment from "moment";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { Argos } from "./parsers/argos";
puppeteer.use(StealthPlugin());
puppeteer.use(require("puppeteer-extra-plugin-anonymize-ua")());

const PUPPETEER_ARGS = ["--no-sandbox", "--disable-setuid-sandbox"];

export type Report = {
  startedAt: Date;
  finishedAt?: Date;
  page: Page;
  pageUrl: string;
  pageNumber: number;
  errors: ReportError[];
  elementsFound?: number;
  nextPageAvailable: boolean;
  parsedElementItemsSuc: number;
  parsedElementItemsFail: number;
};

export type ReportError = {
  expected: string;
  result: string;
  severity: Severity;
  operation: string;
  element?: string;
  elementHash?: string;
  elementIndex?: number;
};

export type Severity = "low" | "medium" | "high";

// A `main` function so that you can use async/await
async function main() {
  const storePage:
    | (Page & {
        store: Store;
      })
    | null = await prisma.page.findFirst({
    include: { store: true },
    where: { updatedAt: { lte: moment().subtract(3, "hours").toDate() } },
  });

  if (storePage !== null) {
    const browser = await puppeteer.launch({
      args: PUPPETEER_ARGS,
      headless: false,
    });
    const page = await browser.newPage();

    if (storePage.store.title === "Argos")
      await new Argos(storePage, page).scrape();

    await browser.close();
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
