import { Brand, Page, PrismaClient, Store } from "@prisma/client";
const prisma = new PrismaClient();
import * as seed from "../src/backup/seed.json";
import { Seed } from "../src/backup/types";

async function main() {
  const seedResult: Seed = seed as Seed;

  for (const brand of seedResult.brands) {
    brand.models &&
      (await prisma.brand.create({
        data: {
          title: brand.title,
          models: {
            createMany: {
              data: brand.models.map((model) => ({ title: model.title })),
              skipDuplicates: true,
            },
          },
        },
      }));
  }

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
      const p: Page = await prisma.page.create({
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
          brand: page.brand
            ? {
                connect: {
                  title: page.brand.title,
                },
              }
            : undefined,
        },
      });

      for (const item of page.items) {
        const brand: Brand | null = item.brand
          ? await prisma.brand.upsert({
              where: { title: item.brand.title },
              create: { title: item.brand.title },
              update: {},
            })
          : null;

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
            brand: brand ? { connect: { id: brand.id } } : undefined,
            model:
              item.model && brand
                ? {
                    connectOrCreate: {
                      where: {
                        composedId: {
                          brandId: brand.id,
                          title: item.model.title,
                        },
                      },
                      create: { brandId: brand.id, title: item.model.title },
                    },
                  }
                : undefined,
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

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
