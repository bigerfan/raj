import "server-only";
import type {
  ListProductsParams,
  Paginated,
  ProductCard,
  ProductDetail,
} from "../types";
import { serverFetch } from "./fetch";

export const getProducts = (params: ListProductsParams = {}) =>
  serverFetch<Paginated<ProductCard>>("/products", { query: { ...params } });

/** Throws ApiError (status 404) when the product doesn't exist OR isn't visible to this user. */
export const getProduct = (slug: string) =>
  serverFetch<ProductDetail>(`/products/${encodeURIComponent(slug)}`);
