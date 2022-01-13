import { BaseSpiderComponent } from "./component";
import { prisma } from "../prisma";
import moment from "moment";
import { StorePage } from "../service/page.service";

export class PageServiceComponent extends BaseSpiderComponent {
  async checkForPage(): Promise<void> {
    const storePage: StorePage | null = await prisma.page.findFirst({
      include: { store: true },
      where: {
        AND: {
          updatedAt: { lte: moment().subtract(3, "hours").toDate() },
          pageStatus: "WAITING",
        },
      },
    });

    if (storePage) this.spider.onStorePageFound(storePage);
  }
}
