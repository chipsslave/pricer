import { Brand, Item, Model, Page, Price, Store } from "@prisma/client";
import { prisma } from "../prisma";
import fs from "node:fs";
import moment from "moment";

async function main(): Promise<void> {
  const db: (Store & {
    pages: (Page & {
      items: (Item & {
        prices: Price[];
        brand: Brand | null;
        model: Model | null;
      })[];
      brand: Brand | null;
    })[];
  })[] = await prisma.store.findMany({
    include: {
      pages: {
        include: {
          items: { include: { prices: true, brand: true, model: true } },
          brand: true,
        },
      },
    },
  });

  const brandsDb: (Brand & {
    models: Model[];
  })[] = await prisma.brand.findMany({
    include: {
      models: true,
    },
  });

  const brands = brandsDb.map((brand) => {
    return {
      title: brand.title,
      models: brand.models.map((model) => {
        return { title: model.title };
      }),
    };
  });

  const stores = db.map((store) => ({
    createdAt: store.createdAt,
    updatedAt: store.updatedAt,
    homeUrl: store.homeUrl,
    title: store.title,
    pages: store.pages.map((page) => {
      return {
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
        url: page.url,
        itemsPerPage: page.itemsPerPage,
        pageStartsAt: page.pageStartsAt,
        body: page.body,
        description: page.description,
        pageStatus: page.pageStatus,
        store: store.title,
        brand: page.brand ? { title: page.brand.title } : null,
        items: page.items.map((item) => ({
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          title: item.title,
          upc: item.upc,
          url: item.url,
          imageUrl: item.imageUrl,
          store: store.title,
          brand: item.brand ? { title: item.brand.title } : null,
          model: item.model ? { title: item.model.title } : null,
          prices: item.prices.map((price) => ({
            createdAt: price.createdAt,
            price: price.price,
            delta: price.delta,
          })),
        })),
      };
    }),
  }));

  const results = { brands, stores };

  fs.writeFile(
    `./src/backup/rawJson/${moment().format("HH-mm DD-MM-YYYY")}.json`,
    JSON.stringify(results),
    (err) => {
      if (err) {
        throw err;
      }
      console.log("JSON data is saved.");
    }
  );
}

main();
