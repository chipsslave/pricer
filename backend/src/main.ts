import { ArgosSpider } from "./mediator/argos.spider";
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

cron.schedule("* * * * *", async () => {
  if (!jobRunning) {
    console.log(`Running a scheduled task at: ${new Date()}`);
    const storePage: StorePage | null = await checkForPage();
    try {
      if (storePage) {
        jobRunning = true;
        console.log(`Found ${storePage.store.title} ${storePage.url}`);
        await updateToProcessing(storePage);
        if (storePage.store.title === "Argos") {
          console.log("Start crawling.");
          const argosSpider: ArgosSpider = new ArgosSpider(storePage);
          await argosSpider.crawl();
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
