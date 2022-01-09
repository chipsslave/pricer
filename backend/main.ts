import { Page, PrismaClient } from "@prisma/client";
import moment from "moment";

const prisma = new PrismaClient();

// A `main` function so that you can use async/await
async function main() {
  const pages = await prisma.page.findMany({
    include: { store: true },
    where: { updatedAt: { lte: moment().subtract(3, "hours").toDate() } },
  });

  type Report = {
    startedAt: Date;
    finishedAt?: Date;
    page: Page;
    pagesScraped: number;
  };

  if (pages.length > 0) {
    pages.forEach((page) => {
      const report: Report = {
        startedAt: moment().toDate(),
        page,
        pagesScraped: 0,
      };
    });
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
