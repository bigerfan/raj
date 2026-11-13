import { Router } from "express";
import {
  getCategoryHandler,
  listCategoriesHandler,
} from "./categories.controller.js";

const router = Router();

router.get("/", listCategoriesHandler);
router.get("/:slug", getCategoryHandler);

export default router;
