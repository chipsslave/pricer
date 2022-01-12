import { ReportService } from "./../service/report.service";
import { HTMLElement } from "node-html-parser";
import { Parser } from "../parsers/argos.parser";

interface Command {
  execute(): void;
}

export class ParsePageElementsCommand implements Command {
  private parser: Parser;
  private reportService: ReportService;
  private pageContent: HTMLElement;

  constructor(
    parser: Parser,
    reportService: ReportService,
    pageContent: HTMLElement
  ) {
    this.parser = parser;
    this.reportService = reportService;
    this.pageContent = pageContent;
  }

  public execute(): void {
    const elements: HTMLElement[] = this.parser.parseItemElements(
      this.pageContent
    );
    this.reportService.setCurrentReportElements(elements);
  }
}
