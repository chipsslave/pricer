export type RootHSamuel = {
  results: Result[];
};

export type Result = {
  hits: Hit[];
  nbPages?: number;
  page?: number;
};

export type Hit = {
  sku_id?: number;
  long_name?: string;
  current_price?: number;
  product_detail_url?: string;
  image?: string;
  stock_count?: number;
  supplier_model_number?: string;
  total_review_count?: number;
  brand?: Brand | null;
  instock_website?: boolean;
  ean_number?: number;
  movement?: string;
};

export type Brand = {
  lvl0?: string;
  lvl1?: string;
  lvl2?: string;
};
