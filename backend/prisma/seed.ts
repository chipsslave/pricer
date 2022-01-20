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
          {
            url: "https://www.argos.co.uk/browse/jewellery-and-watches/watches/mens-watches/c:29307/opt/page:1/",
            itemsPerPage: 63,
            pageStartsAt: 1,
          },
          {
            url: "https://www.argos.co.uk/browse/technology/sound-bars/c:30123/opt/page:1/",
            itemsPerPage: 63,
            pageStartsAt: 1,
          },
          {
            url: "https://www.argos.co.uk/browse/baby-and-nursery/prams-and-pushchairs/c:29042/opt/page:1/",
            itemsPerPage: 63,
            pageStartsAt: 1,
          },
          {
            url: "https://www.argos.co.uk/browse/toys/lego/c:30379/opt/page:1/",
            itemsPerPage: 63,
            pageStartsAt: 1,
          },
          {
            url: "https://www.argos.co.uk/browse/jewellery-and-watches/womens-jewellery/womens-bracelets/c:29312/opt/page:1/",
            itemsPerPage: 63,
            pageStartsAt: 1,
          },
          {
            url: "https://www.argos.co.uk/browse/jewellery-and-watches/womens-jewellery/womens-necklaces/c:29316/opt/page:1/",
            itemsPerPage: 63,
            pageStartsAt: 1,
          },
          {
            url: "https://www.argos.co.uk/browse/jewellery-and-watches/womens-jewellery/womens-earrings/c:29315/opt/page:1/",
            itemsPerPage: 63,
            pageStartsAt: 1,
          },
          {
            url: "https://www.argos.co.uk/browse/health-and-beauty/fragrance/perfume/c:29282/opt/page:1/",
            itemsPerPage: 63,
            pageStartsAt: 1,
          },
        ],
      },
    },
  });

  console.log({ argosStore });

  const hsStore: Store = await prisma.store.upsert({
    where: { title: "H. Samuel" },
    update: {},
    create: {
      title: "H. Samuel",
      homeUrl: "https://www.hsamuel.co.uk",
      pages: {
        create: [
          {
            url: "https://4zmivjgj4y-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.9.1)%3B%20Browser%3B%20instantsearch.js%20(4.33.2)%3B%20Vue%20(2.6.12)%3B%20Vue%20InstantSearch%20(3.7.0)%3B%20JS%20Helper%20(3.6.2)",
            itemsPerPage: 24,
            pageStartsAt: 0,
            body: '{"requests":[{"indexName":"liveA_HSAMUEL_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=24&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=true&facets=%5B%22*%22%5D&tagFilters=&facetFilters=%5B%5B%22category.lvl0%3Awatches%22%5D%2C%5B%22recipient%3Ahim%22%5D%5D"},{"indexName":"liveA_HSAMUEL_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=false&attributesToRetrieve=%5B%5D&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&tagFilters=&analytics=false&facets=category.lvl0&facetFilters=%5B%5B%22recipient%3Ahim%22%5D%5D"},{"indexName":"liveA_HSAMUEL_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=false&attributesToRetrieve=%5B%5D&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&tagFilters=&analytics=false&facets=recipient&facetFilters=%5B%5B%22category.lvl0%3Awatches%22%5D%5D"}]}',
          },
        ],
      },
    },
  });

  console.log({ hsStore });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
