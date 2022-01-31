import { ArgosSpider } from "./scraper/argos/argos.spider";
import { ErnestJonesSpider } from "./scraper/ernestjones/ernestjones.spider";
import { HSamuelSpider } from "./scraper/hsamuel/hsamuel.spider";
import { JuraSpider } from "./scraper/jura/jura.spider";
import { Watches2uSpider } from "./scraper/watches2u/watches2u.spider";
import {
  StorePage,
  checkForPage,
  updateToProcessing,
  updateToWaiting,
} from "./service/page.service";

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
        jobRunning = true;
        console.log(`Found ${storePage.store.title} ${storePage.description}`);
        await updateToProcessing(storePage);
        if (storePage.store.title === "Argos") {
          console.log("Start crawling.");
          const spider: ArgosSpider = new ArgosSpider(storePage);
          await spider.crawl();
          console.log("Finish crawling.");
        }
        if (storePage.store.title === "H. Samuel") {
          console.log("Start crawling.");
          const spider: HSamuelSpider = new HSamuelSpider(storePage);
          await spider.crawl();
          console.log("Finish crawling.");
        }
        if (storePage.store.title === "Ernest Jones") {
          console.log("Start crawling.");
          const spider: ErnestJonesSpider = new ErnestJonesSpider(storePage);
          await spider.crawl();
          console.log("Finish crawling.");
        }
        if (storePage.store.title === "Watches 2 U") {
          console.log("Start crawling.");
          const spider: Watches2uSpider = new Watches2uSpider(storePage);
          await spider.crawl();
          console.log("Finish crawling.");
        }
        if (storePage.store.title === "Jura Watches") {
          console.log("Start crawling.");
          const spider: JuraSpider = new JuraSpider(storePage);
          await spider.crawl();
          console.log("Finish crawling.");
        }
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
