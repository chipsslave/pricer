import { Page, PrismaClient, Store } from "@prisma/client";
const prisma = new PrismaClient();
import * as seed from "../src/backup/seed.json";
import { SeedResult } from "../src/backup/types";

async function main() {
  const seedResult: SeedResult = seed;

  for (const store of seedResult.stores) {
    const s: Store = await prisma.store.create({
      data: {
        title: store.title,
        homeUrl: store.homeUrl,
        createdAt: store.createdAt,
        updatedAt: store.updatedAt,
      },
    });

    for (const page of store.pages) {
      let p: Page;

      p = page.brand
        ? await prisma.page.create({
            data: {
              url: page.url,
              itemsPerPage: page.itemsPerPage,
              pageStartsAt: page.pageStartsAt,
              body: page.body,
              description: page.description,
              pageStatus: "WAITING",
              createdAt: page.createdAt,
              updatedAt: page.updatedAt,
              store: { connect: { id: s.id } },
              brand: {
                connectOrCreate: {
                  create: { title: page.brand.title },
                  where: { title: page.brand.title },
                },
              },
            },
          })
        : await prisma.page.create({
            data: {
              url: page.url,
              itemsPerPage: page.itemsPerPage,
              pageStartsAt: page.pageStartsAt,
              body: page.body,
              description: page.description,
              pageStatus: "WAITING",
              createdAt: page.createdAt,
              updatedAt: page.updatedAt,
              store: { connect: { id: s.id } },
            },
          });

      for (const item of page.items) {
        if (p.brandId) {
          await prisma.item.create({
            data: {
              title: item.title,
              upc: item.upc,
              url: item.url,
              imageUrl: item.imageUrl,
              page: { connect: { id: p.id } },
              store: { connect: { id: s.id } },
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
              brand: { connect: { id: p.brandId } },
              prices: {
                createMany: {
                  data: item.prices.map((price) => {
                    return {
                      price: parseFloat(price.price),
                      delta: parseFloat(price.delta),
                      createdAt: price.createdAt,
                    };
                  }),
                },
              },
            },
          });
        } else {
          await prisma.item.create({
            data: {
              title: item.title,
              upc: item.upc,
              url: item.url,
              imageUrl: item.imageUrl,
              page: { connect: { id: p.id } },
              store: { connect: { id: s.id } },
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
              prices: {
                createMany: {
                  data: item.prices.map((price) => {
                    return {
                      price: parseFloat(price.price),
                      delta: parseFloat(price.delta),
                      createdAt: price.createdAt,
                    };
                  }),
                },
              },
            },
          });
        }
      }
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
