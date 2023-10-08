import * as puppeteer from "puppeteer";
import { Browser } from "puppeteer";
import { saveToFile } from "./utils/saveToFile";

export async function run() {
  let browser: Browser | undefined;
  try {
    browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    const url = "https://www.hotukdeals.com/new";
    await page.goto(url);

    const content = await page.content();
    const timestamp = Date.now();
    const uniqueId = Math.random().toString(36).substr(2, 9); // generating a random unique id

    // cleaning the URL to use in filename
    const cleanedUrl = url
      .replace(/^https?:\/\//, "") // remove protocol
      .replace(/[^a-z0-9]/gi, "_") // replace any characters that are not alphanumeric with underscore
      .replace(/_$/, ""); // remove trailing underscore if present

    const filename = `${timestamp}_${uniqueId}_${cleanedUrl}.html`;

    saveToFile(content, filename);

    console.log(`Page source saved to ${filename}`);
  } finally {
    await browser?.close();
  }
}
