import { Browser } from "puppeteer";
import { saveToFile } from "../utils/saveToFile";

export async function run() {
  let browser: Browser | undefined;
  try {
    const puppeteer = require('puppeteer-extra');
    const StealthPlugin = require('puppeteer-extra-plugin-stealth')
    puppeteer.use(StealthPlugin())
    const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
    puppeteer.use(AdblockerPlugin({ blockTrackers: true }))

    browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser?.newPage();

    const url = "https://www.hotukdeals.com/new";
    await page?.goto(url);

    const content = await page?.content();
    const timestamp = Date.now();
    const uniqueId = Math.random().toString(36).substr(2, 9); // generating a random unique id

    // cleaning the URL to use in filename
    const cleanedUrl = url
      .replace(/^https?:\/\//, "") // remove protocol
      .replace(/[^a-z0-9]/gi, "_") // replace any characters that are not alphanumeric with underscore
      .replace(/_$/, ""); // remove trailing underscore if present

    const filename = `${timestamp}_${uniqueId}_${cleanedUrl}.html`;

    saveToFile(content ? content : "", filename);

    console.log(`Page source saved to ${filename}`);
  } finally {
    await browser?.close();
  }
}
