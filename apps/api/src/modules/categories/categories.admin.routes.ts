import { Router } from "express";
import { upload } from "../../common/middleware/upload.js";
import {
  removeCategoryImageHandler,
  setCategoryImageHandler,
} from "./categories.admin.controller.js";

const router = Router();

router.put(
  "/categories/:id/image",
  upload.single("image"),
  setCategoryImageHandler,
);

router.delete("/categories/:id/image", removeCategoryImageHandler);

export default router;
