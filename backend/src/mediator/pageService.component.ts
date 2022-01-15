import { prisma } from "../prisma";
import moment from "moment";
import { StorePage } from "../service/page.service";

export class PageServiceComponent {
  async checkForPage(): Promise<StorePage | null> {
    const storePage: StorePage | null = await prisma.page.findFirst({
      include: { store: true },
      where: {
        AND: {
          updatedAt: { lte: moment().subtract(3, "hours").toDate() },
          pageStatus: "WAITING",
        },
      },
    });

    return storePage;
  }
}
