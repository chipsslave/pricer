import Cron from "croner";
import { run } from "./src/hotukdeals";

const job = Cron('*/3 * * * *', async () => {
    console.log('Running ');
    await run();
});
