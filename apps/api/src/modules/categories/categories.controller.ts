import type { RequestHandler } from "express";
import { getCategoryBySlug, getCategoryTree } from "./categories.service.js";

export const listCategoriesHandler: RequestHandler = async (_req, res) => {
  res.json({ items: await getCategoryTree() });
};

export const getCategoryHandler: RequestHandler = async (req, res) => {
  res.json(await getCategoryBySlug(req.params.slug as string));
};
