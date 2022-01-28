import { prisma } from "./prisma";

const bodies = [
  {
    brand: "Tudor",
    count: 57,
    url: "https://4zmivjgj4y-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.9.1)%3B%20Browser%3B%20instantsearch.js%20(4.33.2)%3B%20Vue%20(2.6.12)%3B%20Vue%20InstantSearch%20(3.7.0)%3B%20JS%20Helper%20(3.6.2)",
    body: '{"requests":[{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1000&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=true&facets=%5B%22*%22%5D&tagFilters=&facetFilters=%5B%5B%22category.lvl0%3Awatches%22%5D%2C%5B%22brand.lvl0%3ATudor%22%5D%5D"},{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=false&attributesToRetrieve=%5B%5D&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&tagFilters=&analytics=false&facets=category.lvl0&facetFilters=%5B%5B%22brand.lvl0%3ATudor%22%5D%5D"},{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=false&attributesToRetrieve=%5B%5D&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&tagFilters=&analytics=false&facets=brand.lvl0&facetFilters=%5B%5B%22category.lvl0%3Awatches%22%5D%5D"}]}',
  },
  {
    brand: "Montblanc",
    count: 46,
    url: "https://4zmivjgj4y-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.9.1)%3B%20Browser%3B%20instantsearch.js%20(4.33.2)%3B%20Vue%20(2.6.12)%3B%20Vue%20InstantSearch%20(3.7.0)%3B%20JS%20Helper%20(3.6.2)",
    body: '{"requests":[{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1000&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=true&facets=%5B%22*%22%5D&tagFilters=&facetFilters=%5B%5B%22category.lvl0%3Awatches%22%5D%2C%5B%22brand.lvl0%3AMontblanc%22%5D%5D"},{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=false&attributesToRetrieve=%5B%5D&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&tagFilters=&analytics=false&facets=category.lvl0&facetFilters=%5B%5B%22brand.lvl0%3AMontblanc%22%5D%5D"},{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=false&attributesToRetrieve=%5B%5D&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&tagFilters=&analytics=false&facets=brand.lvl0&facetFilters=%5B%5B%22category.lvl0%3Awatches%22%5D%5D"}]}',
  },
  {
    brand: "Zenith",
    count: 36,
    url: "https://4zmivjgj4y-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.9.1)%3B%20Browser%3B%20instantsearch.js%20(4.33.2)%3B%20Vue%20(2.6.12)%3B%20Vue%20InstantSearch%20(3.7.0)%3B%20JS%20Helper%20(3.6.2)",
    body: '{"requests":[{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1000&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=true&facets=%5B%22*%22%5D&tagFilters=&facetFilters=%5B%5B%22category.lvl0%3Awatches%22%5D%2C%5B%22brand.lvl0%3AZenith%22%5D%5D"},{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=false&attributesToRetrieve=%5B%5D&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&tagFilters=&analytics=false&facets=category.lvl0&facetFilters=%5B%5B%22brand.lvl0%3AZenith%22%5D%5D"},{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=false&attributesToRetrieve=%5B%5D&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&tagFilters=&analytics=false&facets=brand.lvl0&facetFilters=%5B%5B%22category.lvl0%3Awatches%22%5D%5D"}]}',
  },
  {
    brand: "Alpina",
    count: 35,
    url: "https://4zmivjgj4y-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.9.1)%3B%20Browser%3B%20instantsearch.js%20(4.33.2)%3B%20Vue%20(2.6.12)%3B%20Vue%20InstantSearch%20(3.7.0)%3B%20JS%20Helper%20(3.6.2)",
    body: '{"requests":[{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1000&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=true&facets=%5B%22*%22%5D&tagFilters=&facetFilters=%5B%5B%22category.lvl0%3Awatches%22%5D%2C%5B%22brand.lvl0%3AAlpina%22%5D%5D"},{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=false&attributesToRetrieve=%5B%5D&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&tagFilters=&analytics=false&facets=category.lvl0&facetFilters=%5B%5B%22brand.lvl0%3AAlpina%22%5D%5D"},{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=false&attributesToRetrieve=%5B%5D&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&tagFilters=&analytics=false&facets=brand.lvl0&facetFilters=%5B%5B%22category.lvl0%3Awatches%22%5D%5D"}]}',
  },
  {
    brand: "Bulova",
    count: 58,
    url: "https://4zmivjgj4y-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.9.1)%3B%20Browser%3B%20instantsearch.js%20(4.33.2)%3B%20Vue%20(2.6.12)%3B%20Vue%20InstantSearch%20(3.7.0)%3B%20JS%20Helper%20(3.6.2)",
    body: '{"requests":[{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1000&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=true&facets=%5B%22*%22%5D&tagFilters=&facetFilters=%5B%5B%22category.lvl0%3Awatches%22%5D%2C%5B%22brand.lvl0%3ABulova%22%5D%5D"},{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=false&attributesToRetrieve=%5B%5D&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&tagFilters=&analytics=false&facets=category.lvl0&facetFilters=%5B%5B%22brand.lvl0%3ABulova%22%5D%5D"},{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=false&attributesToRetrieve=%5B%5D&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&tagFilters=&analytics=false&facets=brand.lvl0&facetFilters=%5B%5B%22category.lvl0%3Awatches%22%5D%5D"}]}',
  },
  {
    brand: "Casio",
    count: 41,
    url: "https://4zmivjgj4y-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.9.1)%3B%20Browser%3B%20instantsearch.js%20(4.33.2)%3B%20Vue%20(2.6.12)%3B%20Vue%20InstantSearch%20(3.7.0)%3B%20JS%20Helper%20(3.6.2)",
    body: '{"requests":[{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1000&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=true&facets=%5B%22*%22%5D&tagFilters=&facetFilters=%5B%5B%22category.lvl0%3Awatches%22%5D%2C%5B%22brand.lvl0%3ACasio%22%5D%5D"},{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=false&attributesToRetrieve=%5B%5D&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&tagFilters=&analytics=false&facets=category.lvl0&facetFilters=%5B%5B%22brand.lvl0%3ACasio%22%5D%5D"},{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=false&attributesToRetrieve=%5B%5D&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&tagFilters=&analytics=false&facets=brand.lvl0&facetFilters=%5B%5B%22category.lvl0%3Awatches%22%5D%5D"}]}',
  },
  {
    brand: "Certina",
    count: 39,
    url: "https://4zmivjgj4y-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.9.1)%3B%20Browser%3B%20instantsearch.js%20(4.33.2)%3B%20Vue%20(2.6.12)%3B%20Vue%20InstantSearch%20(3.7.0)%3B%20JS%20Helper%20(3.6.2)",
    body: '{"requests":[{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1000&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=true&facets=%5B%22*%22%5D&tagFilters=&facetFilters=%5B%5B%22category.lvl0%3Awatches%22%5D%2C%5B%22brand.lvl0%3ACertina%22%5D%5D"},{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=false&attributesToRetrieve=%5B%5D&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&tagFilters=&analytics=false&facets=category.lvl0&facetFilters=%5B%5B%22brand.lvl0%3ACertina%22%5D%5D"},{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=false&attributesToRetrieve=%5B%5D&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&tagFilters=&analytics=false&facets=brand.lvl0&facetFilters=%5B%5B%22category.lvl0%3Awatches%22%5D%5D"}]}',
  },
  {
    brand: "Citizen",
    count: 86,
    url: "https://4zmivjgj4y-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.9.1)%3B%20Browser%3B%20instantsearch.js%20(4.33.2)%3B%20Vue%20(2.6.12)%3B%20Vue%20InstantSearch%20(3.7.0)%3B%20JS%20Helper%20(3.6.2)",
    body: '{"requests":[{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1000&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=true&facets=%5B%22*%22%5D&tagFilters=&facetFilters=%5B%5B%22category.lvl0%3Awatches%22%5D%2C%5B%22brand.lvl0%3ACitizen%22%5D%5D"},{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=false&attributesToRetrieve=%5B%5D&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&tagFilters=&analytics=false&facets=category.lvl0&facetFilters=%5B%5B%22brand.lvl0%3ACitizen%22%5D%5D"},{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=false&attributesToRetrieve=%5B%5D&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&tagFilters=&analytics=false&facets=brand.lvl0&facetFilters=%5B%5B%22category.lvl0%3Awatches%22%5D%5D"}]}',
  },
  {
    brand: "Hamilton",
    count: 68,
    url: "https://4zmivjgj4y-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.9.1)%3B%20Browser%3B%20instantsearch.js%20(4.33.2)%3B%20Vue%20(2.6.12)%3B%20Vue%20InstantSearch%20(3.7.0)%3B%20JS%20Helper%20(3.6.2)",
    body: '{"requests":[{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1000&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=true&facets=%5B%22*%22%5D&tagFilters=&facetFilters=%5B%5B%22category.lvl0%3Awatches%22%5D%2C%5B%22brand.lvl0%3AHamilton%22%5D%5D"},{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=false&attributesToRetrieve=%5B%5D&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&tagFilters=&analytics=false&facets=category.lvl0&facetFilters=%5B%5B%22brand.lvl0%3AHamilton%22%5D%5D"},{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=false&attributesToRetrieve=%5B%5D&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&tagFilters=&analytics=false&facets=brand.lvl0&facetFilters=%5B%5B%22category.lvl0%3Awatches%22%5D%5D"}]}',
  },
  {
    brand: "Rotary",
    count: 20,
    url: "https://4zmivjgj4y-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.9.1)%3B%20Browser%3B%20instantsearch.js%20(4.33.2)%3B%20Vue%20(2.6.12)%3B%20Vue%20InstantSearch%20(3.7.0)%3B%20JS%20Helper%20(3.6.2)",
    body: '{"requests":[{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1000&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=true&facets=%5B%22*%22%5D&tagFilters=&facetFilters=%5B%5B%22category.lvl0%3Awatches%22%5D%2C%5B%22brand.lvl0%3ARotary%22%5D%5D"},{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=false&attributesToRetrieve=%5B%5D&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&tagFilters=&analytics=false&facets=category.lvl0&facetFilters=%5B%5B%22brand.lvl0%3ARotary%22%5D%5D"},{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=false&attributesToRetrieve=%5B%5D&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&tagFilters=&analytics=false&facets=brand.lvl0&facetFilters=%5B%5B%22category.lvl0%3Awatches%22%5D%5D"}]}',
  },
  {
    brand: "Timex",
    count: 13,
    url: "https://4zmivjgj4y-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.9.1)%3B%20Browser%3B%20instantsearch.js%20(4.33.2)%3B%20Vue%20(2.6.12)%3B%20Vue%20InstantSearch%20(3.7.0)%3B%20JS%20Helper%20(3.6.2)",
    body: '{"requests":[{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1000&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=true&facets=%5B%22*%22%5D&tagFilters=&facetFilters=%5B%5B%22category.lvl0%3Awatches%22%5D%2C%5B%22brand.lvl0%3ATimex%22%5D%5D"},{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=false&attributesToRetrieve=%5B%5D&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&tagFilters=&analytics=false&facets=category.lvl0&facetFilters=%5B%5B%22brand.lvl0%3ATimex%22%5D%5D"},{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=false&attributesToRetrieve=%5B%5D&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&tagFilters=&analytics=false&facets=brand.lvl0&facetFilters=%5B%5B%22category.lvl0%3Awatches%22%5D%5D"}]}',
  },
  {
    brand: "Tissot",
    count: 121,
    url: "https://4zmivjgj4y-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.9.1)%3B%20Browser%3B%20instantsearch.js%20(4.33.2)%3B%20Vue%20(2.6.12)%3B%20Vue%20InstantSearch%20(3.7.0)%3B%20JS%20Helper%20(3.6.2)",
    body: '{"requests":[{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1000&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=true&facets=%5B%22*%22%5D&tagFilters=&facetFilters=%5B%5B%22category.lvl0%3Awatches%22%5D%2C%5B%22brand.lvl0%3ATissot%22%5D%5D"},{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=false&attributesToRetrieve=%5B%5D&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&tagFilters=&analytics=false&facets=category.lvl0&facetFilters=%5B%5B%22brand.lvl0%3ATissot%22%5D%5D"},{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=false&attributesToRetrieve=%5B%5D&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&tagFilters=&analytics=false&facets=brand.lvl0&facetFilters=%5B%5B%22category.lvl0%3Awatches%22%5D%5D"}]}',
  },
];

async function main() {
  for (const body of bodies) {
    await prisma.page.create({
      data: {
        description: `${body.brand} watches`,
        itemsPerPage: 1000,
        url: body.url,
        body: body.body,
        pageStatus: "PROCESSING",
        store: { connect: { id: 4 } },
        brand: {
          connectOrCreate: {
            create: { title: body.brand },
            where: { title: body.brand },
          },
        },
      },
    });
  }
}

main();
