import { Page, PrismaClient, Store } from "@prisma/client";
import moment from "moment";

const prisma = new PrismaClient();
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { argos } from "./parsers/argos";
puppeteer.use(StealthPlugin());
puppeteer.use(require("puppeteer-extra-plugin-anonymize-ua")());

const PUPPETEER_ARGS = ["--no-sandbox", "--disable-setuid-sandbox"];

export type Report = {
  startedAt: Date;
  finishedAt?: Date;
  page: string;
  pageNumber: number;
  errors: Error[];
  elementsFound?: number;
  nextPageAvailable: boolean;
};

export type Error = {
  expected: string;
  received: string;
  severity: Severity;
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
    const reports: Report[] = [];

    const browser = await puppeteer.launch({
      args: PUPPETEER_ARGS,
      headless: false,
    });
    const page = await browser.newPage();

    if (storePage.store.title === "Argos")
      await argos(storePage, reports, page);

    await browser.close();

    console.log(...reports);
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
