// export interface SeedModel {
//   title: string;
// }

// export interface SeedBrand {
//   title: string;
//   models?: SeedModel[];
// }

// export interface SeedPage {
//   createdAt: string;
//   updatedAt: string;
//   url: string;
//   itemsPerPage: number;
//   pageStartsAt: number;
//   body?: string | null;
//   description: string;
//   pageStatus: string;
//   store: string;
//   brand: SeedBrand | null;
// }

// export interface SeedStore {
//   createdAt: string;
//   updatedAt: string;
//   homeUrl: string;
//   title: string;
//   pages: SeedPage[];
// }

export interface Seed {
  brands: SeedBrand[];
  stores: SeedStore[];
}
export interface SeedStore {
  createdAt: string;
  updatedAt: string;
  homeUrl: string;
  title: string;
  pages: SeedPage[];
}
export interface SeedPage {
  createdAt: string;
  updatedAt: string;
  url: string;
  itemsPerPage: number;
  pageStartsAt: number;
  body?: string;
  description: string;
  pageStatus: string;
  store: string;
  brand?: SeedModel;
  items: SeedItem[];
}
export interface SeedItem {
  createdAt: string;
  updatedAt: string;
  title: string;
  upc: string;
  url: string;
  imageUrl?: string;
  store: string;
  brand?: SeedModel;
  model?: SeedModel | SeedModel | SeedModel | null;
  prices: SeedPrice[];
}
export interface SeedPrice {
  createdAt: string;
  price: string;
  delta: string;
}
export interface SeedBrand {
  title: string;
  models: SeedModel[];
}
export interface SeedModel {
  title: string;
}
