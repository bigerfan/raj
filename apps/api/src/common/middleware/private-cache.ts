import type { RequestHandler } from "express";

/** For responses that depend on who is asking. Stops shared caches (CDN, proxy) from storing them. */
export const privateCache: RequestHandler = (_req, res, next) => {
  res.set({ "Cache-Control": "private, no-cache", Vary: "Cookie" });
  next();
};
