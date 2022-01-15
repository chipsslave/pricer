import { BrowserServiceComponent } from "./mediator/browserService.component";
import { Page, JobErrorSeverity } from "@prisma/client";
import { prisma } from "./prisma";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { PageServiceComponent } from "./mediator/pageService.component";
import { ArgosParserServiceComponent } from "./mediator/parserService.component";
import { Spider } from "./mediator/mediator";
puppeteer.use(StealthPlugin());
puppeteer.use(require("puppeteer-extra-plugin-anonymize-ua")());

export type Report = {
  startedAt: Date;
  finishedAt?: Date;
  page: Page;
  pageUrl: string;
  pageNumber: number;
  reportErrors: ReportError[];
  elementsFound?: number;
  nextPageAvailable: boolean;
  parsedElementItemsSuc: number;
  parsedElementItemsFail: number;
  currentElements: string[];
};

export type ReportError = {
  expected: string;
  result: string;
  severity: JobErrorSeverity;
  operation: string;
  element?: ReportErrorElement;
  elementIndex: number;
};

export type ReportErrorElement = {
  element: string;
  elementHash: string;
};

export type PageContent = {
  url: string;
  content: string;
};

export type ParsedElementItem = {
  element: string;
  elementHash: string;
  elementIndex: number;
  item: {
    title: string | null;
    upc: string | null;
    price: number | null;
    url: string | null;
  };
};

// A `main` function so that you can use async/await
async function main() {
  const pageService: PageServiceComponent = new PageServiceComponent();
  const browserService: BrowserServiceComponent = new BrowserServiceComponent();
  const parserService: ArgosParserServiceComponent =
    new ArgosParserServiceComponent();
  const spider: Spider = new Spider(pageService, browserService, [
    parserService,
  ]);
  await spider.run();
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
