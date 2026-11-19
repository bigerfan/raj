import "server-only";
import type { CategoryDetail, CategoryNode } from "../types";
import { serverFetch } from "./fetch";

// the same for everybody, so no cookie and a short cache
const publicCache = { auth: false, next: { revalidate: 300 } } as const;

export async function getCategories(): Promise<CategoryNode[]> {
  const { items } = await serverFetch<{ items: CategoryNode[] }>(
    "/categories",
    publicCache,
  );
  return items;
}

export const getCategory = (slug: string) =>
  serverFetch<CategoryDetail>(
    `/categories/${encodeURIComponent(slug)}`,
    publicCache,
  );
