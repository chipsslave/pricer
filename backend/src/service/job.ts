import moment from "moment";
import { Brand, JobErrorSeverity, Model, Price } from "@prisma/client";
import { ParserResult } from "../parser/parser";
import { prisma } from "../prisma";
import { StorePage } from "./page.service";

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

  constructor(
    page: StorePage,
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

  async save(parserResult: ParserResult): Promise<void> {
    await prisma.job.create({
      data: {
        startedAt: this.startedAt,
        finishedAt: this.finishedAt,
        page: { connect: { id: this.page.id } },
        pageUrl: parserResult.pageUrl,
        pageNumber: parserResult.pageNumber,
        elementsFound: parserResult.elementsCount,
        nextPageAvailable: parserResult.nextPage ? true : false,
        parsedElementItemsSuc: parserResult.parsedItemsSuccessCount,
        parsedElementItemsFail: parserResult.parsedItemsFailCount,
        jobErrors: {
          connectOrCreate: parserResult.parserErrors.map((je) => ({
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

    for (const parsedItem of parserResult.parsedItems) {
      if (!parsedItem.brand || !parsedItem.model) {
        const calculated = await this.calculateBrandAndModel(
          [parsedItem.title, parsedItem.model].join(" ")
        );

        if (
          parsedItem.brand &&
          calculated.brand &&
          parsedItem.brand !== calculated.brand
        ) {
          console.log("Calculated brand titles do not match.");
          console.log({ ...parsedItem });
          console.log("Calculated brand: ", calculated.brand);
        }

        if (
          parsedItem.model &&
          calculated.model &&
          parsedItem.model !== calculated.model
        ) {
          console.log("Calculated model titles do not match.");
          console.log({ ...parsedItem });
          console.log("Calculated model: ", calculated.model);
        }

        if (!parsedItem.brand) {
          parsedItem.brand = calculated.brand;
        }

        if (!parsedItem.model) {
          parsedItem.model = calculated.model;
        }
      }

      if (parsedItem.brand === "CALVIN KLEIN")
        parsedItem.brand = "Calvin Klein";
      if (parsedItem.brand === "Victorinox Swiss Army")
        parsedItem.brand = "Victorinox";
      if (parsedItem.brand === "Versus") parsedItem.brand = "Versus Versace";
      if (parsedItem.brand?.startsWith("Garmin")) parsedItem.brand = "Garmin";
      try {
        const pageBrand: Brand | null = this.page.brand;

        const itemBrand: Brand | null =
          (parsedItem.brand &&
            (await prisma.brand.upsert({
              where: { title: parsedItem.brand },
              create: { title: parsedItem.brand },
              update: {},
            }))) ||
          null;

        const brandId: number | null | undefined =
          pageBrand?.id || itemBrand?.id;

        let itemModel: Model | null =
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

        if (!brandId && parsedItem.model) {
          itemModel = await prisma.model.findUnique({
            where: { title: parsedItem.model },
          });
        }

        const item = await prisma.item.upsert({
          where: { upc: parsedItem.upc },
          update: {
            title: parsedItem.title,
            url: parsedItem.url,
            imageUrl: parsedItem.image,
            pageId: this.page.id,
            brandId: pageBrand?.id || itemBrand?.id,
            modelId: itemModel?.id,
          },
          create: {
            title: parsedItem.title,
            upc: parsedItem.upc,
            url: parsedItem.url,
            imageUrl: parsedItem.image,
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
      } catch (e) {
        console.log("failed on: ", { ...parsedItem });
      }
    }
  }

  // async processParsedItem(item: ParsedItem): Promise<void> {
  //   if (item.brand === "CALVIN KLEIN") item.brand = "Calvin Klein";
  //   if (item.brand === "Victorinox Swiss Army") item.brand = "Victorinox";
  //   if (item.brand === "Versus") item.brand = "Versus Versace";
  //   if (item.brand?.startsWith("Garmin")) item.brand = "Garmin";

  //   const brands = await prisma.brand.findMany({
  //     select: { id: true, title: true, models: true },
  //   });
  // }

  async calculateBrandAndModel(
    title: string
  ): Promise<{ brand: string | undefined; model: string | undefined }> {
    const brands = await prisma.brand.findMany({
      select: { id: true, title: true, models: true },
    });

    const result: { brand: string | undefined; model: string | undefined } = {
      brand: undefined,
      model: undefined,
    };

    title = title.toLowerCase();

    let countBrands: number = 0;
    let countModels: number = 0;

    for (const brand of brands) {
      if (title.includes(brand.title.toLowerCase())) {
        countBrands++;
        result.brand = brand.title;
        for (const model of brand.models) {
          if (title.includes(model.title.toLowerCase())) {
            countModels++;
            result.model = model.title;
          }
        }
      }
    }

    if (countBrands > 1) result.brand = undefined;
    if (countModels > 1) result.model = undefined;

    return result;
  }
}
