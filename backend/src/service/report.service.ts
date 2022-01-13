import { Report, ReportError } from "../main";
import moment from "moment";
import { Page } from "@prisma/client";
import { prisma } from "../prisma";

export class ReportService {
  private readonly storePage: Page;
  private report: Report;
  private failedElementHashes: Set<string> = new Set<string>();

  constructor(storePage: Page) {
    this.storePage = storePage;
    this.report = {
      startedAt: moment().toDate(),
      page: storePage,
      pageUrl: storePage.url,
      pageNumber: storePage.pageStartsAt,
      reportErrors: [],
      nextPageAvailable: false,
      parsedElementItemsSuc: 0,
      parsedElementItemsFail: 0,
      currentElements: [],
    };
  }

  reset(nextPageUrl: string, nextPageNumber: number) {
    this.report = {
      startedAt: moment().toDate(),
      page: this.storePage,
      pageUrl: nextPageUrl,
      pageNumber: nextPageNumber,
      reportErrors: [],
      nextPageAvailable: false,
      parsedElementItemsSuc: 0,
      parsedElementItemsFail: 0,
      currentElements: [],
    };
    this.failedElementHashes.clear();
  }

  async finish() {
    this.report.finishedAt = moment().toDate();
    const report = await prisma.report.create({
      data: {
        startedAt: this.report.startedAt,
        finishedAt: this.report.finishedAt,
        page: { connect: { id: this.storePage.id } },
        pageUrl: this.report.pageUrl,
        pageNumber: this.report.pageNumber,
        elementsFound: this.report.elementsFound || 0,
        nextPageAvailable: this.report.nextPageAvailable,
        parsedElementItemsFail: this.report.parsedElementItemsFail,
        parsedElementItemsSuc: this.report.parsedElementItemsSuc,
        reportErrors: {
          connectOrCreate: this.report.reportErrors.map((re) => ({
            create: {
              expected: re.expected,
              result: re.result,
              severity: re.severity,
              operation: re.operation,
              elementIndex: re.elementIndex,
            },
            where: {
              composedId: {
                expected: re.expected,
                result: re.result,
                severity: re.severity,
                operation: re.operation,
                elementIndex: re.elementIndex,
              },
            },
          })),
        },
      },
      include: { reportErrors: true },
    });

    console.log({ report });
  }

  handleError(reportError: ReportError) {
    this.report.reportErrors.push(reportError);
    if (
      reportError.element &&
      !this.failedElementHashes.has(reportError.element.elementHash)
    ) {
      this.report.parsedElementItemsFail += 1;
      this.failedElementHashes.add(reportError.element?.elementHash);
    }
  }

  handleSuccess() {
    this.report.parsedElementItemsSuc += 1;
  }

  setNextPageAvailable(nextPageAvailable: boolean) {
    this.report.nextPageAvailable = nextPageAvailable;
  }

  setNextPageUrlAndNumber(pageUrl: string, pageNumber: number) {
    this.report.pageUrl = pageUrl;
    this.report.pageNumber = pageNumber;
  }

  setElementsFoundCount(elementsCount: number) {
    this.report.elementsFound = elementsCount;

    if (this.storePage.itemsPerPage !== this.getElementsFoundCount())
      this.handleError({
        expected: `Elements count ${this.storePage.itemsPerPage}`,
        result: `Elements count ${this.getElementsFoundCount()}`,
        severity: this.getElementsFoundCount() == 0 ? "HIGH" : "LOW",
        operation:
          "Checking if count of parsed elements matches expected count of elements.",
        elementIndex: -1,
      });
  }

  getCurrentPageUrl(): string {
    return this.report.pageUrl;
  }

  getElementsFoundCount(): number {
    return this.report.elementsFound || -1;
  }

  getCurrentPageNumber(): number {
    return this.report.pageNumber;
  }

  getNextPageAvailable(): boolean {
    return this.report.nextPageAvailable;
  }

  setCurrentReportElements(elements: string[]): void {
    this.report.currentElements = elements;
    this.report.elementsFound = elements.length;

    if (this.storePage.itemsPerPage !== this.getElementsFoundCount())
      this.handleError({
        expected: `Elements count ${this.storePage.itemsPerPage}`,
        result: `Elements count ${this.getElementsFoundCount()}`,
        severity: this.getElementsFoundCount() == 0 ? "HIGH" : "LOW",
        operation:
          "Checking if count of parsed elements matches expected count of elements.",
        elementIndex: -1,
      });
  }
}
