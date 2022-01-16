import { BrowserServiceComponent } from "./mediator/browserService.component";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { ArgosParserServiceComponent } from "./mediator/parserService.component";
import { Spider } from "./mediator/spider";
import { PageService } from "./service/page.service";
puppeteer.use(StealthPlugin());
puppeteer.use(require("puppeteer-extra-plugin-anonymize-ua")());
var cron = require("node-cron");

const pageService: PageService = new PageService();
const browserService: BrowserServiceComponent = new BrowserServiceComponent();
const argosParser: ArgosParserServiceComponent =
  new ArgosParserServiceComponent();
const spider: Spider = new Spider(pageService, browserService, [argosParser]);

// A `main` function so that you can use async/await
// async function main() {
//   await spider.run();
// }

cron.schedule("* * * * *", async () => {
  console.log("running a task every minute");
  // prisma.$connect();
  spider.run();
});

// main()
//   .catch((e) => {
//     throw e;
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
