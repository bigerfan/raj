import type { Request, RequestHandler } from "express";
import { unauthorized } from "../../common/errors.js";
import type { ClientMeta } from "./auth.types.js";
import { loginWithOtp } from "./auth.service.js";
import { REFRESH_COOKIE, clearAuthCookies, setAuthCookies } from "./cookies.js";
import { requestOtp } from "./otp.service.js";
import { revokeSession, rotateSession } from "./session.service.js";

const clientMeta = (req: Request): ClientMeta => ({
  userAgent: req.get("user-agent")?.slice(0, 255),
  ip: req.ip,
});

export const requestOtpHandler: RequestHandler = async (req, res) => {
  res.json(await requestOtp(req.body.phone));
};

export const verifyOtpHandler: RequestHandler = async (req, res) => {
  const { user, tokens } = await loginWithOtp(
    req.body.phone,
    req.body.code,
    clientMeta(req),
  );
  setAuthCookies(res, tokens);
  res.json({ user });
};

export const refreshHandler: RequestHandler = async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (!token) throw unauthorized();
  try {
    setAuthCookies(res, await rotateSession(token, clientMeta(req)));
    res.status(204).end();
  } catch (err) {
    clearAuthCookies(res);
    throw err;
  }
};

export const logoutHandler: RequestHandler = async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (token) await revokeSession(token);
  clearAuthCookies(res);
  res.status(204).end();
};

export const meHandler: RequestHandler = (req, res) => {
  res.json({ user: req.user });
};
