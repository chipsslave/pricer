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

const cron = require("node-cron");

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
          const spider = new PuppeteerSpider(new ArgosParser(), false);
          spider.setStorePage(storePage);
          await spider.run();
        }
        if (storePage.store.title === "H. Samuel") {
          const spider = new FetchJsonSpider(new HSamuelParser());
          spider.setStorePage(storePage);
          await spider.run();
        }
        if (storePage.store.title === "Ernest Jones") {
          const spider = new FetchJsonSpider(new ErnestJonesParser());
          spider.setStorePage(storePage);
          await spider.run();
        }
        if (storePage.store.title === "Watches 2 U") {
          const spider = new FetchHtmlSpider(new Watches2uParser());
          spider.setStorePage(storePage);
          await spider.run();
        }
        if (storePage.store.title === "Jura Watches") {
          const spider = new FetchHtmlSpider(new JuraParserServiceComponent());
          spider.setStorePage(storePage);
          await spider.run();
        }
        if (storePage.store.title === "Hilliers Jewellers") {
          const spider = new FetchHtmlSpider(new HilliersParser());
          spider.setStorePage(storePage);
          await spider.run();
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
