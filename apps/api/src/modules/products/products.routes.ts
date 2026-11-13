import { Router } from "express";
import { privateCache } from "../../common/middleware/private-cache.js";
import { optionalAuth } from "../auth/auth.middleware.js";
import {
  getProductHandler,
  listProductsHandler,
} from "./products.controller.js";

const router = Router();

router.use(optionalAuth, privateCache);
router.get("/", listProductsHandler);
router.get("/:slug", getProductHandler);

export default router;
