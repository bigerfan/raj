import { prisma, type CustomerType } from "../../lib/db.js";
import { AppError } from "../../common/errors.js";
import { getCategoryIdsWithDescendants } from "../categories/categories.service.js";
import type { ListProductsQuery } from "./products.schemas.js";
import { toProductCard, toProductDetail } from "./products.mapper.js";

/** A product exists for an audience only if it has an active variant with an active offer for them. */
const visibleTo = (audience: CustomerType) => ({
  isActive: true,
  variants: {
    some: { isActive: true, offers: { some: { isActive: true, audience } } },
  },
});

const productSelect = (audience: CustomerType) => ({
  id: true,
  slug: true,
  name: true,
  description: true,
  categories: { where: { isActive: true }, select: { slug: true, name: true } },
  variants: {
    where: { isActive: true, offers: { some: { isActive: true, audience } } },
    orderBy: { createdAt: "asc" as const },
    select: {
      id: true,
      sku: true,
      color: true,
      model: true,
      stock: true,
      offers: {
        where: { isActive: true, audience },
        orderBy: { unitsPerPack: "asc" as const },
        select: { id: true, unitsPerPack: true, price: true, minPacks: true },
      },
    },
  },
});

export async function listProducts(
  audience: CustomerType,
  query: ListProductsQuery,
) {
  let categoryIds: string[] | undefined;
  if (query.category) {
    const ids = await getCategoryIdsWithDescendants(query.category);
    if (!ids)
      throw new AppError(404, "Category not found", "CATEGORY_NOT_FOUND");
    categoryIds = ids;
  }

  const where = {
    ...visibleTo(audience),
    ...(categoryIds
      ? { categories: { some: { id: { in: categoryIds } } } }
      : {}),
    ...(query.q
      ? { name: { contains: query.q, mode: "insensitive" as const } }
      : {}),
  };

  const [rows, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      select: productSelect(audience),
      orderBy:
        query.sort === "name"
          ? [{ name: "asc" as const }, { id: "asc" as const }]
          : [{ createdAt: "desc" as const }, { id: "asc" as const }],
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items: rows.map(toProductCard),
    page: query.page,
    limit: query.limit,
    total,
    totalPages: Math.ceil(total / query.limit),
  };
}

export async function getProductBySlug(audience: CustomerType, slug: string) {
  const product = await prisma.product.findFirst({
    where: { slug, ...visibleTo(audience) },
    select: productSelect(audience),
  });
  if (!product)
    throw new AppError(404, "Product not found", "PRODUCT_NOT_FOUND");
  return toProductDetail(product);
}
