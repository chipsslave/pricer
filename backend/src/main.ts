import { FetchHtmlSpider } from "./mediator/fetchHtmlSpider";
import { FetchJsonSpider } from "./mediator/fetchJsonSpider";
import { ErnestJonesParser } from "./scraper/ernestjones/ernestjones.parser";
import { HSamuelParser } from "./scraper/hsamuel/hsamuel.parser";
import { ArgosParser } from "./scraper/argos/argos.parser";
import {
  StorePage,
  checkForPage,
  updateToProcessing,
  updateToWaiting,
} from "./service/page.service";
import { PuppeteerSpider } from "./mediator/puppeteerSpider";
import { HilliersParser } from "./scraper/hilliers/hilliers.parser";
import { Watches2uParser } from "./scraper/watches2u/watches2u.parser";
import { JuraParserServiceComponent } from "./scraper/jura/jura.parser";
import { Parser } from "./mediator/parserService.component";

const cron = require("node-cron");

const puppeteerSpider = new PuppeteerSpider(false);
// const puppeteerSpiderHeadless = new PuppeteerSpider(true);
const fetchJsonSpider = new FetchJsonSpider();
const fetchHtmlSpider = new FetchHtmlSpider();

const argosParser: Parser<string> = new ArgosParser();
const hSamuelParser: Parser<unknown> = new HSamuelParser();
const ernestJonesParser: Parser<unknown> = new ErnestJonesParser();
const watches2UParser: Parser<unknown> = new Watches2uParser();
const juraParser: Parser<unknown> = new JuraParserServiceComponent();
const hilliersParser: Parser<unknown> = new HilliersParser();

// A `main` function so that you can use async/await
// async function main() {
//   await spider.run();
// }

let jobRunning: boolean = false;

cron.schedule("*/10 * * * * *", async () => {
  if (!jobRunning) {
    console.log(`Running a scheduled task at: ${new Date()}`);
    const storePage: StorePage | null = await checkForPage();
    try {
      if (storePage) {
        console.log("Start crawling.");
        jobRunning = true;
        console.log(`Found ${storePage.store.title} ${storePage.description}`);
        await updateToProcessing(storePage);
        if (storePage.store.title === "Argos") {
          puppeteerSpider.setParser(argosParser);
          puppeteerSpider.setStorePage(storePage);
          await puppeteerSpider.run();
        }
        if (storePage.store.title === "H. Samuel") {
          fetchJsonSpider.setParser(hSamuelParser);
          fetchJsonSpider.setStorePage(storePage);
          await fetchJsonSpider.run();
        }
        if (storePage.store.title === "Ernest Jones") {
          fetchJsonSpider.setParser(ernestJonesParser);
          fetchJsonSpider.setStorePage(storePage);
          await fetchJsonSpider.run();
        }
        if (storePage.store.title === "Watches 2 U") {
          fetchHtmlSpider.setParser(watches2UParser);
          fetchHtmlSpider.setStorePage(storePage);
          await fetchHtmlSpider.run();
        }
        if (storePage.store.title === "Jura Watches") {
          fetchHtmlSpider.setParser(juraParser);
          fetchHtmlSpider.setStorePage(storePage);
          await fetchHtmlSpider.run();
        }
        if (storePage.store.title === "Hilliers Jewellers") {
          fetchHtmlSpider.setParser(hilliersParser);
          fetchHtmlSpider.setStorePage(storePage);
          await fetchHtmlSpider.run();
        }
        console.log("Finish crawling.");
        await updateToWaiting(storePage);
      }
    } catch (e) {
      console.log(e);
    } finally {
      if (storePage) await updateToWaiting(storePage);
      jobRunning = false;
    }
  }
});

// main()
//   .catch((e) => {
//     throw e;
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
