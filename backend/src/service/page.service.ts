import { Page, Store } from ".prisma/client";
import { prisma } from "../prisma";
import moment from "moment";

export type StorePage = Page & {
  store: Store;
};

export class PageService {
  async checkForPage(): Promise<StorePage | null> {
    return prisma.page.findFirst({
      include: { store: true },
      where: {
        AND: {
          updatedAt: { lte: moment().subtract(3, "hours").toDate() },
          pageStatus: "WAITING",
        },
      },
    });
  }

  async updateToProcessing(page: Page): Promise<Page> {
    return prisma.page.update({
      where: { id: page.id },
      data: {
        pageStatus: "PROCESSING",
      },
    });
  }

  async updateToWaiting(page: Page): Promise<Page> {
    return prisma.page.update({
      where: { id: page.id },
      data: {
        pageStatus: "WAITING",
      },
    });
  }
}
