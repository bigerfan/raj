import { Router } from "express";
import rateLimit from "express-rate-limit";
import { validate } from "../../common/middleware/validate.js";
import { requireAuth } from "./auth.middleware.js";
import {
  logoutHandler,
  meHandler,
  refreshHandler,
  requestOtpHandler,
  verifyOtpHandler,
} from "./auth.controller.js";
import { requestOtpSchema, verifyOtpSchema } from "./auth.schema.js";

const router = Router();

// per-IP limit; the per-phone limits live in otp.service.ts
const ipLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
  "/otp/request",
  ipLimiter,
  validate(requestOtpSchema),
  requestOtpHandler,
);
router.post(
  "/otp/verify",
  ipLimiter,
  validate(verifyOtpSchema),
  verifyOtpHandler,
);
router.post("/refresh", refreshHandler);
router.post("/logout", logoutHandler);
router.get("/me", requireAuth, meHandler);

export default router;
