import moment from "moment";
import { prisma } from "./prisma";
import fs from "node:fs";
// import crypto from "crypto";

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

bodies;

// async function main() {
//   for (const body of bodies) {
//     await prisma.page.create({
//       data: {
//         description: `${body.brand} watches`,
//         itemsPerPage: 1000,
//         url: body.url,
//         body: body.body,
//         pageStatus: "PROCESSING",
//         store: { connect: { id: 4 } },
//         brand: {
//           connectOrCreate: {
//             create: { title: body.brand },
//             where: { title: body.brand },
//           },
//         },
//       },
//     });
//   }
// }

// main();

// async function fixBody() {
//   const pages = await prisma.page.findMany({
//     where: { OR: [{ storeId: 2 }, { storeId: 3 }] },
//   });

//   for (const page of pages) {
//     console.log(page.url);
//     const body = page.body;
//     if (!body) return;
//     const regx = new RegExp("liveA", "g");
//     const cleanText = body.replace(regx, "liveB");
//     await prisma.page.update({
//       where: { id: page.id },
//       data: { body: cleanText },
//     });
//   }
// }

// fixBody();

// async function trimTitles() {
//   const items = await prisma.item.findMany();

//   for (const item of items) {
//     const titleTrim: string = item.title.trim();

//     // if (item.storeId === 4) {
//     //   const upc: string = crypto
//     //     .createHash("md5")
//     //     .update(titleTrim)
//     //     .digest("hex");

//     //   const fullUpc: string = `W2U_${upc}`;

//     //   if (item.upc !== fullUpc) console.log({ old: item.upc, new: fullUpc });
//     // }

//     await prisma.item.update({
//       where: { id: item.id },
//       data: { title: titleTrim },
//     });
//   }
// }

// trimTitles();

// async function trimBrands() {
//   const items = await prisma.brand.findMany();

//   for (const item of items) {
//     const titleTrim: string = item.title.trim();

//     // if (item.storeId === 4) {
//     //   const upc: string = crypto
//     //     .createHash("md5")
//     //     .update(titleTrim)
//     //     .digest("hex");

//     //   const fullUpc: string = `W2U_${upc}`;

//     //   if (item.upc !== fullUpc) console.log({ old: item.upc, new: fullUpc });
//     // }

//     await prisma.brand.update({
//       where: { id: item.id },
//       data: { title: titleTrim },
//     });
//   }
// }

// trimBrands();

// async function trimModels() {
//   const items = await prisma.model.findMany();

//   for (const item of items) {
//     const titleTrim: string = item.title.trim();

//     // if (item.storeId === 4) {
//     //   const upc: string = crypto
//     //     .createHash("md5")
//     //     .update(titleTrim)
//     //     .digest("hex");

//     //   const fullUpc: string = `W2U_${upc}`;

//     //   if (item.upc !== fullUpc) console.log({ old: item.upc, new: fullUpc });
//     // }

//     await prisma.model.update({
//       where: { id: item.id },
//       data: { title: titleTrim },
//     });
//   }
// }

// trimModels();

async function deals() {
  const startOfToday = moment().startOf("day");

  const prices = await prisma.price.findMany({ include: { item: true } });

  const tPricesWithNegativeDelta = prices.filter((price) => {
    const createdAt = moment(price.createdAt);
    const delta = price.delta?.toNumber();

    if (!delta) return false;

    const isToday = startOfToday.isBefore(createdAt);
    if (isToday && delta < -20) {
      return true;
    }

    return false;
  });

  const items = await prisma.item.findMany({
    where: { id: { in: tPricesWithNegativeDelta.map((p) => p.itemId) } },
    include: { prices: true, brand: true, model: true },
  });

  const brands = items.map((i) => i.brand?.title || "No Brand");

  for (const brand of brands) {
    fs.writeFile(
      `./src/deals/${brand}-${moment().format("DD-MM-YYYY")}.json`,
      JSON.stringify(
        items.filter((i) => {
          if (brand === "No Brand" && !i.brand) return true;
          if (i.brand?.title === brand) return true;
        }),
        null,
        2
      ),
      (err) => {
        if (err) {
          throw err;
        }
        console.log("JSON data is saved.");
      }
    );
  }
}

deals();

// async function del() {
//   const prices = await prisma.price.findMany({
//     where: { item: { storeId: 2 } },
//   });

//   console.log("1: ", prices.length);

//   for (const price of prices) {
//     const startOfToday = moment().startOf("day");

//     const isToday = startOfToday.isBefore(moment(price.createdAt));

//     if (isToday) {
//       await prisma.price.delete({ where: { id: price.id } });
//     }
//   }

//   const prices2 = await prisma.price.findMany({
//     where: { item: { storeId: 2 } },
//   });

//   console.log("2: ", prices2.length);
// }

// del();
