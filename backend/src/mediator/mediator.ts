import { StorePage } from "../service/page.service";
import { BrowserServiceComponent } from "./browserService.component";
import { PageServiceComponent } from "./pageService.component";
import { Parser, ParserResult } from "./parserService.component";
import { Job } from "./jobService.component";

export class Spider {
  private pageService: PageServiceComponent;
  private browserService: BrowserServiceComponent;

  private parsers: Parser[];

  private storePage: StorePage;

  private job: Job | null;

  constructor(
    pageService: PageServiceComponent,
    browserService: BrowserServiceComponent,
    parsers: Parser[]
  ) {
    this.pageService = pageService;
    this.browserService = browserService;
    this.parsers = parsers;
  }

  getStorePage(): StorePage {
    return this.storePage;
  }

  async run(): Promise<void> {
    const storePage: StorePage | null = await this.pageService.checkForPage();
    if (!storePage) return;
    this.storePage = storePage;
    this.job = new Job(storePage, storePage.url, storePage.pageStartsAt);

    const parser: Parser = this.findParser();
    await this.browserService.launch();
    await this.browserService.goTo(this.storePage.url);
    parser.setup(
      this.storePage,
      await this.browserService.getPageHtmlContent(),
      this.storePage.url,
      this.storePage.pageStartsAt
    );

    let parserResult: ParserResult = parser.parse();
    this.job.processParserResults({ ...parserResult });
    this.job.recordFinishedAt();
    await this.job.save();

    if (parserResult.nextPage)
      do {
        this.job = new Job(
          storePage,
          parserResult.nextPage?.pageUrl,
          parserResult.nextPage.pageNumber
        );
        await this.browserService.goTo(parserResult.nextPage.pageUrl);
        parser.setup(
          this.storePage,
          await this.browserService.getPageHtmlContent(),
          parserResult.nextPage?.pageUrl,
          parserResult.nextPage.pageNumber
        );
        parserResult = parser.parse();
        this.job.processParserResults({ ...parserResult });
        this.job.recordFinishedAt();
        await this.job.save();
      } while (parserResult.nextPage);

    await this.browserService.close();
  }

  findParser(): Parser {
    const parser: Parser | undefined = this.parsers.find((p) =>
      p.canParse(this.storePage.store.title)
    );

    if (!parser) throw new Error("No available parser found.");
    return parser;
  }
}
