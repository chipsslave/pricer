import { run } from "./hotukdeals";

(async () => {
  try {
    await run();
  } catch (e) {
    // Deal with the fact the chain failed
    console.error(e);
  }
  // `text` is not available here
})();
