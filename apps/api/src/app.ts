import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler } from "./common/middleware/error-handler.js";
import authRouter from "./modules/auth/auth.routes.js";
import productsRouter from "./modules/products/products.routes.js";
import categoriesRouter from "./modules/categories/categories.routes.js";

export function createApp() {
  const app = express();

  // behind a reverse proxy in production, add: app.set("trust proxy", 1)
  app.use(cors({ origin: env.WEB_URL, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.use("/auth", authRouter);

  app.use("/categories", categoriesRouter);
  app.use("/products", productsRouter);

  app.use(errorHandler);
  return app;
}
