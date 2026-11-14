import type { RequestHandler } from "express";
import {
  addVariantImages,
  deleteVariantImage,
} from "./variant-images.service.js";

export const uploadVariantImagesHandler: RequestHandler = async (req, res) => {
  const files = (req.files as Express.Multer.File[] | undefined) ?? [];
  res
    .status(201)
    .json({
      items: await addVariantImages(req.params.variantId as string, files),
    });
};

export const deleteVariantImageHandler: RequestHandler = async (req, res) => {
  await deleteVariantImage(req.params.imageId as string);
  res.status(204).end();
};
