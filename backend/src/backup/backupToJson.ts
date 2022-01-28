import { Item, Page, Price, Store } from "@prisma/client";
import { prisma } from "../prisma";
import fs from "node:fs";
import moment from "moment";

async function main(): Promise<void> {
  const db: (Store & {
    pages: (Page & {
      items: (Item & {
        prices: Price[];
      })[];
    })[];
  })[] = await prisma.store.findMany({
    include: {
      pages: {
        include: { items: { include: { prices: true } } },
      },
    },
  });

  const brands = [
    { title: "Seiko" },
    { title: "Tommy Hilfiger" },
    { title: "Accurist" },
    { title: "Alpina" },
    { title: "Bulova" },
    { title: "Casio" },
    { title: "Citizen" },
    { title: "Garmin" },
    { title: "Hamilton" },
    { title: "Swatch" },
    { title: "Timex" },
    { title: "Tissot" },
    { title: "Rotary" },
    { title: "Fitbit" },
    { title: "Lorus" },
  ];

  const stores = db.map((store) => ({
    createdAt: store.createdAt,
    updatedAt: store.updatedAt,
    homeUrl: store.homeUrl,
    title: store.title,
    pages: store.pages.map((page) => ({
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
      url: page.url,
      itemsPerPage: page.itemsPerPage,
      pageStartsAt: page.pageStartsAt,
      body: page.body,
      description: page.description,
      pageStatus: page.pageStatus,
      store: store.title,
      brand:
        brands.find((brand) => page.description.includes(brand.title)) || null,
      items: page.items.map((item) => ({
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
        title: item.title,
        upc: item.upc,
        url: item.url,
        imageUrl: item.imageUrl,
        store: store.title,
        prices: item.prices.map((price) => ({
          createdAt: page.createdAt,
          price: price.price,
          delta: price.delta,
        })),
      })),
    })),
  }));

  const results = { brands, stores };

  fs.writeFile(
    `${moment().format("HH-mm DD-MM-YYYY")}.json`,
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
