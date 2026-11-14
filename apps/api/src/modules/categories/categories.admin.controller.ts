import type { RequestHandler } from "express";
import { removeCategoryImage, setCategoryImage } from "./categories.service.js";

export const setCategoryImageHandler: RequestHandler = async (req, res) => {
  res.json(await setCategoryImage(req.params.id as string, req.file));
};

export const removeCategoryImageHandler: RequestHandler = async (req, res) => {
  await removeCategoryImage(req.params.id as string);
  res.status(204).end();
};
