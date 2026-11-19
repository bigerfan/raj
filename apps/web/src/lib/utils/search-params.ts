import type { ListProductsParams } from "@/lib/api/types";

export type SearchParams = Record<string, string | string[] | undefined>;

export const firstParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export function parsePositiveInt(
  value: string | string[] | undefined,
  fallback: number,
) {
  const n = Number(firstParam(value));
  return Number.isInteger(n) && n > 0 ? n : fallback;
}

/** Never trusts the URL: bad values fall back to defaults instead of reaching the API as a 400. */
export function parseProductListParams(sp: SearchParams): ListProductsParams {
  return {
    category: firstParam(sp.category) || undefined,
    q: firstParam(sp.q)?.trim().slice(0, 100) || undefined,
    sort: firstParam(sp.sort) === "name" ? "name" : "newest",
    page: parsePositiveInt(sp.page, 1),
  };
}

/** Builds "/path?x=1&y=2", skipping empty values (used for filter and pagination links). */
export function buildHref(
  pathname: string,
  params: Record<string, string | number | null | undefined>,
) {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "")
      qs.set(key, String(value));
  }
  const s = qs.toString();
  return s ? `${pathname}?${s}` : pathname;
}
