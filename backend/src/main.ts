import { Parser } from "./parser/parser";
import { ArgosParser } from "./scraper/argos/argos";
import { ErnestJonesParser } from "./scraper/ernestjones/ernestjones";
import { HilliersParser } from "./scraper/hilliers/hilliers";
import { HSamuelParser } from "./scraper/hsamuel/hsamuel";
import { JuraParser } from "./scraper/jura/jura";
import { Watches2UParser } from "./scraper/watches2u/watches2u";
import { WatchHutParser } from "./scraper/watchhut/watchhut";
import {
  checkForPage,
  StorePage,
  updateToProcessing,
  updateToWaiting,
} from "./service/page.service";
import { FetchHtmlSpider } from "./spider/fetchHtmlSpider";
import { FetchJsonSpider } from "./spider/fetchJsonSpider";
import { PuppeteerSpider } from "./spider/puppeteerSpider";

const cron = require("node-cron");

const puppeteerSpider = new PuppeteerSpider(false);
const puppeteerSpiderHeadless = new PuppeteerSpider(true);
const fetchJsonSpider = new FetchJsonSpider();
const fetchHtmlSpider = new FetchHtmlSpider();

const argosParser: Parser<string> = new ArgosParser();
const hSamuelParser: Parser<unknown> = new HSamuelParser();
const ernestJonesParser: Parser<unknown> = new ErnestJonesParser();
const watches2UParser: Parser<string> = new Watches2UParser();
const juraParser: Parser<string> = new JuraParser();
const hilliersParser: Parser<string> = new HilliersParser();
const watchHutParser: Parser<string> = new WatchHutParser();

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
          await puppeteerSpider.crawl();
        }
        if (storePage.store.title === "H. Samuel") {
          fetchJsonSpider.setParser(hSamuelParser);
          fetchJsonSpider.setStorePage(storePage);
          await fetchJsonSpider.crawl();
        }
        if (storePage.store.title === "Ernest Jones") {
          fetchJsonSpider.setParser(ernestJonesParser);
          fetchJsonSpider.setStorePage(storePage);
          await fetchJsonSpider.crawl();
        }
        if (storePage.store.title === "Watches 2 U") {
          fetchHtmlSpider.setParser(watches2UParser);
          fetchHtmlSpider.setStorePage(storePage);
          await fetchHtmlSpider.crawl();
        }
        if (storePage.store.title === "Jura Watches") {
          fetchHtmlSpider.setParser(juraParser);
          fetchHtmlSpider.setStorePage(storePage);
          await fetchHtmlSpider.crawl();
        }
        if (storePage.store.title === "Hilliers Jewellers") {
          fetchHtmlSpider.setParser(hilliersParser);
          fetchHtmlSpider.setStorePage(storePage);
          await fetchHtmlSpider.crawl();
        }
        if (storePage.store.title === "Watch Hut") {
          puppeteerSpiderHeadless.setParser(watchHutParser);
          puppeteerSpiderHeadless.setStorePage(storePage);
          await puppeteerSpiderHeadless.crawl();
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
