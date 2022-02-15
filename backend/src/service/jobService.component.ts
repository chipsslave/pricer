import moment from "moment";
import { Brand, JobErrorSeverity, Model, Price } from "@prisma/client";
import { ParserResult } from "../parser/parserService.component";
import { prisma } from "../prisma";
import { StorePage } from "./page.service";

export type ParsedItem = {
  title: string;
  upc: string;
  price: number;
  url: string;
  img?: string;
  brand?: string;
  model?: string;
};

export type JobError = {
  expected: string;
  result: string;
  severity: JobErrorSeverity;
  operation: string;
  elementHash?: string;
  elementIndex: number;
};

export class Job {
  private startedAt: Date;
  private finishedAt: Date;
  private page: StorePage;
  private pageUrl: string;
  private pageNumber: number;
  private jobErrors: Set<JobError> = new Set<JobError>();
  private elementsCount: number;
  private nextPageAvailable: boolean;
  private parsedElementItemsSuc: number = 0;
  private parsedElementItemsFail: number = 0;
  private parsedItems: ParsedItem[];

  constructor(
    page: StorePage,
    pageUrl: string = page.url,
    pageNumber: number = page.pageStartsAt
  ) {
    this.page = page;
    this.pageUrl = pageUrl;
    this.pageNumber = pageNumber;
    this.startedAt = moment().toDate();
    this.parsedItems = [];
  }

  recordFinishedAt(): void {
    this.finishedAt = moment().toDate();
  }

  getPageUrl(): string {
    return this.pageUrl;
  }

  getPageNumber(): number {
    return this.pageNumber;
  }

  getJobErrorsArray(): JobError[] {
    const array: JobError[] = [];

    for (const entry of this.jobErrors) {
      array.push(entry);
    }

    return array;
  }

  private calculateSeverity(
    expected: number,
    result: number
  ): JobErrorSeverity {
    if (result === 0) return "HIGH";
    if (result < expected) return "MEDIUM";
    if (result > expected) return "HIGH";
    return "LOW";
  }

  processParserResults(parserResult: ParserResult): void {
    this.elementsCount = parserResult.elementsCount;
    if (this.elementsCount != this.page.itemsPerPage)
      this.jobErrors.add({
        operation: "checking count of elements",
        expected: `expecting to find ${this.page.itemsPerPage} elements`,
        result: `found ${this.elementsCount} elements`,
        severity: this.calculateSeverity(
          this.page.itemsPerPage,
          this.elementsCount
        ),
        elementIndex: -1,
      });
    this.nextPageAvailable = parserResult.nextPage ? true : false;
    parserResult.parsedItems.forEach((pr) => {
      if (pr.success) {
        // work on item
        this.parsedElementItemsSuc += 1;
        this.parsedItems.push({
          title: pr.item.title || "",
          upc: pr.item.upc || "",
          price: pr.item.price || 0,
          url: pr.item.url || "",
          img: pr.item.image || undefined,
          brand: pr.item.brand || undefined,
          model: pr.item.model || undefined,
        });
      } else {
        // record error
        this.parsedElementItemsFail += 1;
        if (!pr.item.title)
          this.jobErrors.add({
            operation: "parsing title",
            expected: "result should not be null",
            result: "result is null",
            severity: "HIGH",
            elementHash: pr.elementHash,
            elementIndex: pr.elementIndex,
          });

        if (!pr.item.upc)
          this.jobErrors.add({
            operation: "parsing upc",
            expected: "result should not be null",
            result: "result is null",
            severity: "HIGH",
            elementHash: pr.elementHash,
            elementIndex: pr.elementIndex,
          });

        if (!pr.item.price)
          this.jobErrors.add({
            operation: "parsing price",
            expected: "result should not be null",
            result: "result is null",
            severity: "HIGH",
            elementHash: pr.elementHash,
            elementIndex: pr.elementIndex,
          });

        if (!pr.item.url)
          this.jobErrors.add({
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
    await prisma.job.create({
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
          connectOrCreate: this.getJobErrorsArray().map((je) => ({
            where: {
              composedId: {
                expected: je.expected,
                result: je.result,
                severity: je.severity,
                elementIndex: je.elementIndex,
                operation: je.operation,
              },
            },
            create: {
              expected: je.expected,
              result: je.result,
              severity: je.severity,
              elementIndex: je.elementIndex,
              operation: je.operation,
            },
          })),
        },
      },
      include: { jobErrors: true },
    });

    for (const parsedItem of this.parsedItems) {
      const pageBrand: Brand | null = this.page.brand;

      const itemBrand: Brand | null =
        (parsedItem.brand &&
          (await prisma.brand.upsert({
            where: { title: parsedItem.brand },
            create: { title: parsedItem.brand },
            update: {},
          }))) ||
        null;

      const brandId: number | null | undefined = pageBrand?.id || itemBrand?.id;

      const itemModel: Model | null =
        (brandId &&
          parsedItem.model &&
          (await prisma.model.upsert({
            where: {
              composedId: {
                brandId,
                title: parsedItem.model,
              },
            },
            create: { brandId, title: parsedItem.model },
            update: {},
          }))) ||
        null;

      const item = await prisma.item.upsert({
        where: { upc: parsedItem.upc },
        update: {
          title: parsedItem.title,
          url: parsedItem.url,
          imageUrl: parsedItem.img,
          pageId: this.page.id,
          brandId: pageBrand?.id || itemBrand?.id,
          modelId: itemModel?.id,
        },
        create: {
          title: parsedItem.title,
          upc: parsedItem.upc,
          url: parsedItem.url,
          imageUrl: parsedItem.img,
          storeId: this.page.storeId,
          pageId: this.page.id,
          brandId: pageBrand?.id || itemBrand?.id,
          modelId: itemModel?.id,
        },
        include: { prices: true },
      });

      if (item.prices.length == 0) {
        await prisma.price.create({
          data: { price: parsedItem.price, itemId: item.id },
        });
      } else {
        const lastPriceId: number = Math.max(...item.prices.map((p) => p.id));
        const price: Price | undefined = item.prices.find(
          (p) => p.id === lastPriceId
        );

        if (!price) return;

        if (parsedItem.price != price.price.toNumber()) {
          const delta: number =
            (parsedItem.price / price.price.toNumber() - 1) * 100;
          await prisma.price.create({
            data: {
              itemId: item.id,
              price: parsedItem.price,
              delta,
            },
          });
        }
      }
    }
  }
}
