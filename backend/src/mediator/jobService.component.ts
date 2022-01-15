import moment from "moment";
import { Page, JobErrorSeverity } from "@prisma/client";
import { ParserResult } from "./parserService.component";
import { prisma } from "../prisma";

export type JobError = {
  expected: string;
  result: string;
  severity: JobErrorSeverity;
  operation: string;
  elementHash?: string;
  elementIndex?: number;
};

export class Job {
  private startedAt: Date;
  private finishedAt: Date;
  private page: Page;
  private pageUrl: string;
  private pageNumber: number;
  private jobErrors: JobError[] = [];
  private elementsCount: number;
  private nextPageAvailable: boolean;
  private parsedElementItemsSuc: number = 0;
  private parsedElementItemsFail: number = 0;

  constructor(
    page: Page,
    pageUrl: string = page.url,
    pageNumber: number = page.pageStartsAt
  ) {
    this.page = page;
    this.pageUrl = pageUrl;
    this.pageNumber = pageNumber;
    this.startedAt = moment().toDate();
  }

  recordFinishedAt(): void {
    this.finishedAt = moment().toDate();
  }

  calculateSeverity(expected: number, result: number): JobErrorSeverity {
    if (expected === 0) return "HIGH";
    if (result < expected) return "MEDIUM";
    if (result > expected) return "HIGH";
    return "LOW";
  }

  processParserResults(parserResult: ParserResult): void {
    this.elementsCount = parserResult.elementsCount;
    if (this.elementsCount != this.page.itemsPerPage)
      this.jobErrors.push({
        operation: "checking count of elements",
        expected: `expecting to find ${this.page.itemsPerPage} elements`,
        result: `found ${this.elementsCount} elements`,
        severity: this.calculateSeverity(
          this.page.itemsPerPage,
          this.elementsCount
        ),
      });
    this.nextPageAvailable = parserResult.nextPage ? true : false;
    parserResult.parsedItems.forEach((pr) => {
      if (pr.success) {
        // work on item
        this.parsedElementItemsSuc += 1;
      } else {
        // record error
        this.parsedElementItemsFail += 1;
        if (!pr.item.title)
          this.jobErrors.push({
            operation: "parsing title",
            expected: "result should not be null",
            result: "result is null",
            severity: "HIGH",
            elementHash: pr.elementHash,
            elementIndex: pr.elementIndex,
          });

        if (!pr.item.upc)
          this.jobErrors.push({
            operation: "parsing upc",
            expected: "result should not be null",
            result: "result is null",
            severity: "HIGH",
            elementHash: pr.elementHash,
            elementIndex: pr.elementIndex,
          });

        if (!pr.item.price)
          this.jobErrors.push({
            operation: "parsing price",
            expected: "result should not be null",
            result: "result is null",
            severity: "HIGH",
            elementHash: pr.elementHash,
            elementIndex: pr.elementIndex,
          });

        if (!pr.item.url)
          this.jobErrors.push({
            operation: "parsing url",
            expected: "result should not be null",
            result: "result is null",
            severity: "HIGH",
            elementHash: pr.elementHash,
            elementIndex: pr.elementIndex,
          });
      }
    });
  }

  async save(): Promise<void> {
    const job = await prisma.job.create({
      data: {
        startedAt: this.startedAt,
        finishedAt: this.finishedAt,
        page: { connect: { id: this.page.id } },
        pageUrl: this.pageUrl,
        pageNumber: this.pageNumber,
        elementsFound: this.elementsCount,
        nextPageAvailable: this.nextPageAvailable,
        parsedElementItemsSuc: this.parsedElementItemsSuc,
        parsedElementItemsFail: this.parsedElementItemsFail,
        jobErrors: {
          connectOrCreate: this.jobErrors.map((je) => ({
            create: {
              expected: je.expected,
              result: je.result,
              severity: je.severity,
              elementIndex: je.elementIndex,
            },
            where: {
              composedId: {
                expected: je.expected,
                result: je.result,
                severity: je.severity,
                elementIndex: je.elementIndex || -1,
              },
            },
          })),
        },
      },
      include: { jobErrors: true },
    });
  }
}
