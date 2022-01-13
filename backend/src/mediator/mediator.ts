import { ReportService } from "./../service/report.service";
import { StorePage } from "../service/page.service";
import { BrowserServiceComponent } from "./browserService.component";
import { PageServiceComponent } from "./pageService.component";
import { PageContent, ParsedElementItem } from "../main";
import { ArgosParserServiceComponent } from "./parserService.component";

export interface ISpider {
  onStorePageFound(storePage: StorePage): void;
  onBrowserLaunched(): void;
  onPageContentFetched(lastPage: PageContent): void;
  onParsedItemElements(elements: string[]): void;
  onItemParsedSuccessfully(item: ParsedElementItem): void;
  onItemParsedUnsuccessfully(item: ParsedElementItem): void;
}

export class Spider implements ISpider {
  private reportService: ReportService;

  private pageService: PageServiceComponent;
  private browserService: BrowserServiceComponent;
  private parserService: ArgosParserServiceComponent;

  constructor(
    pageService: PageServiceComponent,
    browserService: BrowserServiceComponent,
    parserService: ArgosParserServiceComponent
  ) {
    this.pageService = pageService;
    this.pageService.setSpider(this);

    this.browserService = browserService;
    this.browserService.setSpider(this);

    this.parserService = parserService;
    this.parserService.setSpider(this);
  }

  async onStorePageFound(storePage: StorePage): Promise<void> {
    console.log("onStorePageFound");
    this.reportService = new ReportService(storePage);
    await this.browserService.launch();
  }
  async onBrowserLaunched(): Promise<void> {
    console.log("onBrowserLaunched");
    await this.browserService.goTo(this.reportService.getCurrentPageUrl());
  }
  onPageContentFetched(lastPage: PageContent): void {
    console.log("onPageContentFetched", {
      url: lastPage.url,
      content: lastPage.content.substring(0, 20),
    });
    this.parserService.parseItemElements(lastPage.content);
  }
  onParsedItemElements(elements: string[]) {
    this.reportService.setCurrentReportElements(elements);
    for (const [index, element] of elements.entries()) {
      console.log({ index, substring: element.substring(0, 20) });
      this.parserService.parseItem(element, index);
    }
  }
  onItemParsedSuccessfully(item: ParsedElementItem): void {
    console.log("onItemParsedSuccessfully", { item });
    this.reportService.handleSuccess();
    console.log({ item: item.item });
  }
  onItemParsedUnsuccessfully(item: ParsedElementItem): void {
    console.log("onItemParsedUnsuccessfully", { item });
    if (!item.item.title)
      this.reportService.handleError({
        operation: "parsing title",
        expected: "result should not be null",
        result: "result is null",
        severity: "HIGH",
        element: {
          element: item.element,
          elementHash: item.elementHash,
        },
        elementIndex: item.elementIndex,
      });

    if (!item.item.upc)
      this.reportService.handleError({
        operation: "parsing upc",
        expected: "result should not be null",
        result: "result is null",
        severity: "HIGH",
        element: {
          element: item.element,
          elementHash: item.elementHash,
        },
        elementIndex: item.elementIndex,
      });
    if (!item.item.price)
      this.reportService.handleError({
        operation: "parsing price",
        expected: "result should more than 0",
        result: "result is null",
        severity: "HIGH",
        element: {
          element: item.element,
          elementHash: item.elementHash,
        },
        elementIndex: item.elementIndex,
      });
    if (!item.item.url)
      this.reportService.handleError({
        operation: "parsing url",
        expected: "result should not be empty string",
        result: "result is empty string",
        severity: "HIGH",
        element: {
          element: item.element,
          elementHash: item.elementHash,
        },
        elementIndex: item.elementIndex,
      });
  }
}
