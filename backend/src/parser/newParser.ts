import { HTMLElement } from "node-html-parser";
import { PricerLogger } from "../logger/logger";
import { StorePage } from "../service/page.service";

export abstract class NewParser<C> {
  private page: C;
  private storePage: StorePage;
  private logger: PricerLogger;

  constructor(page: C, storePage: StorePage, logger: PricerLogger) {
    this.page = page;
    this.storePage = storePage;
    this.logger = logger;
  }

  abstract nextPageExists(): boolean;

  public getPage(): C {
    return this.page;
  }

  public getStorePage(): StorePage {
    return this.storePage;
  }

  public getExpectedItemCountPerPage(): number {
    return this.storePage.itemsPerPage;
  }

  public getLogger(): PricerLogger {
    return this.logger;
  }
}

export class NewArgosParser extends NewParser<HTMLElement> {
  nextPageExists(): boolean {
    this.getLogger().log("Checking if next page exists.");
    const resultsCountSpan: HTMLElement | null = this.getPage().querySelector(
      "span[class^=styles__ResultsCount]"
    );

    this.getLogger().log(`resultsCountSpan evaluated to: ${resultsCountSpan}`);

    const resultsCount: string | undefined = resultsCountSpan?.getAttribute(
      "data-search-results"
    );

    this.getLogger().log(`resultsCount evaluated to: ${resultsCount}`);

    const count: number = resultsCount
      ? parseInt(resultsCount)
      : this.getExpectedItemCountPerPage();

    this.getLogger().log(`count evaluated to: ${count}`);

    const totalPages = Math.ceil(count / this.getExpectedItemCountPerPage());

    this.getLogger().log(`totalPages evaluated to: ${totalPages}`);

    if (1 < totalPages) {
      this.getLogger().log("Next page exists.");
      return true;
    }

    this.getLogger().log("Next page does not exist.");
    return false;
  }
}
