import { Router } from "express";
import { upload } from "../../common/middleware/upload.js";
import {
  deleteVariantImageHandler,
  uploadVariantImagesHandler,
} from "./products.admin.controller.js";

const router = Router();

router.post(
  "/variants/:variantId/images",
  upload.array("images", 10),
  uploadVariantImagesHandler,
);
router.delete("/variant-images/:imageId", deleteVariantImageHandler);

export default router;
