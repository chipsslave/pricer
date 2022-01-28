export interface SeedModel {
  title: string;
}

export interface SeedBrand {
  title: string;
  models?: SeedModel[];
}

export interface SeedPage {
  createdAt: string;
  updatedAt: string;
  url: string;
  itemsPerPage: number;
  pageStartsAt: number;
  body?: string | null;
  description: string;
  pageStatus: string;
  store: string;
  brand: SeedBrand | null;
}

export interface SeedStore {
  createdAt: string;
  updatedAt: string;
  homeUrl: string;
  title: string;
  pages: SeedPage[];
}
