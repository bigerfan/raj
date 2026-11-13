import type { Request, RequestHandler } from "express";
import { AppError, unauthorized } from "../../common/errors.js";
import { findAuthUser, type AuthUser } from "./auth.types.js";
import { ACCESS_COOKIE } from "./cookies.js";
import { verifyAccessToken } from "./tokens.js";

async function resolveUser(req: Request): Promise<AuthUser | null> {
  const token = req.cookies?.[ACCESS_COOKIE];
  if (!token) return null;

  const userId = await verifyAccessToken(token);
  if (!userId) return null;

  // always read from the DB, so role/customerType/status changes apply immediately
  const user = await findAuthUser(userId);
  if (!user || user.status === "SUSPENDED") return null;
  return user;
}

/** For public routes whose output depends on who is asking (e.g. prices). */
export const optionalAuth: RequestHandler = async (req, _res, next) => {
  req.user = (await resolveUser(req)) ?? undefined;
  next();
};

export const requireAuth: RequestHandler = async (req, _res, next) => {
  const user = await resolveUser(req);
  if (!user) throw unauthorized();
  req.user = user;
  next();
};

export const requireRole =
  (role: AuthUser["role"]): RequestHandler =>
  (req, _res, next) => {
    if (req.user?.role !== role)
      throw new AppError(403, "Forbidden", "FORBIDDEN");
    next();
  };
