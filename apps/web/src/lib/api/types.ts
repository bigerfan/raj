export type Role = "CUSTOMER" | "ADMIN";
export type CustomerType = "RETAIL" | "WHOLESALE";
export type AccountStatus = "ACTIVE" | "PENDING" | "REJECTED" | "SUSPENDED";

export interface AuthUser {
  id: string;
  phone: string;
  name: string | null;
  role: Role;
  customerType: CustomerType;
  status: AccountStatus;
}

export interface RequestOtpResult {
  retryAfterSeconds: number;
  expiresInSeconds: number;
}

export interface CategoryNode {
  id: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  children: CategoryNode[];
}

export interface CategoryDetail {
  id: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  breadcrumb: { slug: string; name: string }[];
  children: Omit<CategoryNode, "children">[];
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  width: number;
  height: number;
}

export interface ProductOffer {
  id: string;
  unitsPerPack: number;
  price: number; // price of ONE pack
  minPacks: number;
  availablePacks: number;
  inStock: boolean;
}

export interface ProductVariant {
  id: string;
  sku: string;
  color: string | null;
  model: string | null;
  offers: ProductOffer[];
  images: ProductImage[];
}

export interface CategoryRef {
  slug: string;
  name: string;
}

export interface ProductDetail {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  categories: CategoryRef[];
  variants: ProductVariant[];
}

export interface ProductCard {
  id: string;
  slug: string;
  name: string;
  categories: CategoryRef[];
  colors: string[];
  priceFrom: { price: number; unitsPerPack: number } | null;
  inStock: boolean;
  image: ProductImage | null;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type ProductSort = "newest" | "name";

export interface ListProductsParams {
  category?: string;
  q?: string;
  sort?: ProductSort;
  page?: number;
  limit?: number;
}
