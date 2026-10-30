export type Category = {
  id: number;
  name: string;
  slug: string;
  parent: number;
  count: number;
  description: string;
  image: string | null;
};

export type Brand = {
  id: number;
  name: string;
  slug: string;
  count: number;
  description: string;
  image: string | null;
};

export type ProductImage = { src: string; alt: string };

export type Product = {
  id: number;
  slug: string;
  name: string;
  sku: string;
  type: string;
  price?: number;
  regularPrice?: number;
  onSale: boolean;
  images: ProductImage[];
  shortDescriptionHtml: string;
  descriptionHtml: string;
  categories: { id: number; name: string; slug: string }[];
  brands: { id: number; name: string; slug: string }[];
  specs: { name: string; value: string }[];
  inStock: boolean;
  backorder: boolean;
  stockText: string;
  purchasable: boolean;
};

/** Slim shape sent to client components (cards, search, cart, favourites). */
export type ProductSummary = {
  id: number;
  slug: string;
  name: string;
  image: string | null;
  brand?: string;
  price?: number;
  regularPrice?: number;
  inStock: boolean;
  backorder: boolean;
  sku?: string;
  /** Needs options picked on the product page (e.g. finish or hand). */
  hasOptions: boolean;
};
