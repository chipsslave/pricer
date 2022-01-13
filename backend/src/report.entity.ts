import { Page, ReportErrorSeverity } from "@prisma/client";

export class ReportDto {
  startedAt: Date;
  finishedAt?: Date;
  page: Page;
  pageUrl: string;
  pageNumber: number;
  reportErrors: ReportError[];
  elementsFound?: number;
  nextPageAvailable: boolean;
  parsedElementItemsSuc: number;
  parsedElementItemsFail: number;
  currentElements: HTMLElement[];
}
