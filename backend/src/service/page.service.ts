import { Brand, Page, Store } from ".prisma/client";
import { prisma } from "../prisma";
import moment from "moment";

export type StorePage = Page & {
  store: Store;
  brand: Brand | null;
};

export async function checkForPage(): Promise<StorePage | null> {
  return prisma.page.findFirst({
    include: { store: true, brand: true },
    where: {
      AND: {
        updatedAt: { lte: moment().subtract(3, "hours").toDate() },
        pageStatus: "WAITING",
      },
    },
  });
}

export async function updateToProcessing(page: Page): Promise<Page> {
  return prisma.page.update({
    where: { id: page.id },
    data: {
      pageStatus: "PROCESSING",
    },
  });
}

export async function updateToWaiting(page: Page): Promise<Page> {
  return prisma.page.update({
    where: { id: page.id },
    data: {
      pageStatus: "WAITING",
    },
  });
}
