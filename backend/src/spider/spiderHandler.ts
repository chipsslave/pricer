import { Parser } from "../parser/parser";
import { ArgosParser } from "../scraper/argos/argos";
import { ErnestJonesParser } from "../scraper/ernestjones/ernestJones";
import { HilliersParser } from "../scraper/hilliers/hilliers";
import { HSamuelParser } from "../scraper/hsamuel/hsamuel";
import { JuraParser } from "../scraper/jura/jura";
import { Watches2UParser } from "../scraper/watches2u/watches2u";
import { WatchHutParser } from "../scraper/watchhut/watchhut";
import {
  StorePage,
  updateToProcessing,
  updateToWaiting,
} from "../service/page.service";
import { FetchHtmlSpider } from "./fetchHtmlSpider";
import { FetchJsonSpider } from "./fetchJsonSpider";
import { PuppeteerSpider } from "./puppeteerSpider";

export class SpiderReporter {}

export class SpiderHandler {
  private puppeteerSpider = new PuppeteerSpider(false);
  private puppeteerSpiderHeadless = new PuppeteerSpider(true);
  private fetchJsonSpider = new FetchJsonSpider();
  private fetchHtmlSpider = new FetchHtmlSpider();

  private argosParser: Parser<string> = new ArgosParser();
  private hSamuelParser: Parser<unknown> = new HSamuelParser();
  private ernestJonesParser: Parser<unknown> = new ErnestJonesParser();
  private watches2UParser: Parser<string> = new Watches2UParser();
  private juraParser: Parser<string> = new JuraParser();
  private hilliersParser: Parser<string> = new HilliersParser();
  private watchHutParser: Parser<string> = new WatchHutParser();

  async onStorePage(storePage: StorePage): Promise<void> {
    console.log("Start crawling.");
    console.log(`Found ${storePage.store.title} ${storePage.description}`);
    await updateToProcessing(storePage);
    if (storePage.store.title === "Argos") {
      this.puppeteerSpider.setParser(this.argosParser);
      this.puppeteerSpider.setStorePage(storePage);
      await this.puppeteerSpider.crawl();
    }
    if (storePage.store.title === "H. Samuel") {
      this.fetchJsonSpider.setParser(this.hSamuelParser);
      this.fetchJsonSpider.setStorePage(storePage);
      await this.fetchJsonSpider.crawl();
    }
    if (storePage.store.title === "Ernest Jones") {
      this.fetchJsonSpider.setParser(this.ernestJonesParser);
      this.fetchJsonSpider.setStorePage(storePage);
      await this.fetchJsonSpider.crawl();
    }
    if (storePage.store.title === "Watches 2 U") {
      this.fetchHtmlSpider.setParser(this.watches2UParser);
      this.fetchHtmlSpider.setStorePage(storePage);
      await this.fetchHtmlSpider.crawl();
    }
    if (storePage.store.title === "Jura Watches") {
      this.fetchHtmlSpider.setParser(this.juraParser);
      this.fetchHtmlSpider.setStorePage(storePage);
      await this.fetchHtmlSpider.crawl();
    }
    if (storePage.store.title === "Hilliers Jewellers") {
      this.fetchHtmlSpider.setParser(this.hilliersParser);
      this.fetchHtmlSpider.setStorePage(storePage);
      await this.fetchHtmlSpider.crawl();
    }
    if (storePage.store.title === "Watch Hut") {
      this.puppeteerSpiderHeadless.setParser(this.watchHutParser);
      this.puppeteerSpiderHeadless.setStorePage(storePage);
      await this.puppeteerSpiderHeadless.crawl();
    }
    console.log("Finish crawling.");
    await updateToWaiting(storePage);
  }
}
