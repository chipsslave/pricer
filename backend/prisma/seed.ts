import { PrismaClient, Store } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const argosStore: Store = await prisma.store.upsert({
    where: { title: "Argos" },
    update: {},
    create: {
      title: "Argos",
      homeUrl: "https://www.argos.co.uk/",
      pages: {
        create: [
          {
            url: "https://www.argos.co.uk/browse/technology/televisions-and-accessories/televisions/c:30106/opt/page:1/",
            itemsPerPage: 63,
            pageStartsAt: 1,
          },
        ],
      },
    },
  });

  console.log({ argosStore });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
