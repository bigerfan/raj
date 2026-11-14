import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Router } from "express";
import { env } from "./config/env.js";
import { errorHandler } from "./common/middleware/error-handler.js";
import authRouter from "./modules/auth/auth.routes.js";
import productsRouter from "./modules/products/products.routes.js";
import categoriesRouter from "./modules/categories/categories.routes.js";
import { requireAuth, requireRole } from "./modules/auth/auth.middleware.js";
import categoriesAdminRouter from "./modules/categories/categories.admin.routes.js";
import productsAdminRouter from "./modules/products/products.admin.routes.js";
import { uploadsRoot } from "./lib/storage/index.js";

export function createApp() {
  const app = express();

  // behind a reverse proxy in production, add: app.set("trust proxy", 1)
  app.use(cors({ origin: env.WEB_URL, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  app.use(
    "/uploads",
    express.static(uploadsRoot, {
      index: false,
      maxAge: "365d",
      immutable: true,
      setHeaders: (res) => res.setHeader("X-Content-Type-Options", "nosniff"),
    }),
  );

  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.use("/auth", authRouter);

  app.use("/categories", categoriesRouter);
  app.use("/products", productsRouter);

  app.use(errorHandler);

  const admin = Router();

  admin.use(requireAuth, requireRole("ADMIN"));
  admin.use(productsAdminRouter);
  admin.use(categoriesAdminRouter);
  app.use("/admin", admin);

  return app;
}
