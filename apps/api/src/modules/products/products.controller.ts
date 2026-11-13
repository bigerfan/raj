import type { RequestHandler } from "express";
import { resolveAudience } from "../../common/audience.js";
import { listProductsQuery } from "./products.schemas.js";
import { getProductBySlug, listProducts } from "./products.service.js";

export const listProductsHandler: RequestHandler = async (req, res) => {
  const query = listProductsQuery.parse(req.query);
  res.json(await listProducts(resolveAudience(req.user), query));
};

export const getProductHandler: RequestHandler = async (req, res) => {
  res.json(
    await getProductBySlug(
      resolveAudience(req.user),
      req.params.slug as string,
    ),
  );
};
