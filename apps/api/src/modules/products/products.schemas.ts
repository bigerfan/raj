import { z } from "zod";

export const listProductsQuery = z.object({
  category: z.string().min(1).optional(),
  q: z.string().trim().min(1).max(100).optional(),
  sort: z.enum(["newest", "name"]).default("newest"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type ListProductsQuery = z.infer<typeof listProductsQuery>;
