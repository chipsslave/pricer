export interface SeedBrand {
  title: string;
}

export interface SeedPrice {
  createdAt: string;
  price: string;
  delta: string;
}

export interface SeedItem {
  createdAt: string;
  updatedAt: string;
  title: string;
  upc: string;
  url: string;
  imageUrl: string | null;
  store: string;
  prices: SeedPrice[];
}

export interface SeedPage {
  createdAt: string;
  updatedAt: string;
  url: string;
  itemsPerPage: number;
  pageStartsAt: number;
  body: string | null;
  description: string;
  pageStatus: string;
  store: string;
  brand: SeedBrand | null;
  items: SeedItem[];
}

export interface SeedStore {
  createdAt: string;
  updatedAt: string;
  homeUrl: string;
  title: string;
  pages: SeedPage[];
}

export interface SeedResult {
  brands: SeedBrand[];
  stores: SeedStore[];
}
