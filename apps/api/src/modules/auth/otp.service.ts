import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { env } from "../../config/env.js";
import { AppError } from "../../common/errors.js";
import { smsProvider } from "./sms/index.js";
import { prisma } from "../../lib/db.js";

const CODE_TTL_MS = 2 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_REQUESTS_PER_HOUR = 5;
const MAX_ATTEMPTS = 5;

const invalidCode = () =>
  new AppError(400, "Invalid or expired code", "OTP_INVALID");

const hashCode = (phone: string, code: string) =>
  createHmac("sha256", env.OTP_PEPPER).update(`${phone}:${code}`).digest("hex");

export async function requestOtp(phone: string) {
  const now = Date.now();

  const recent = await prisma.otpCode.findMany({
    where: { phone, createdAt: { gt: new Date(now - 60 * 60 * 1000) } },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true },
  });

  if (recent.length >= MAX_REQUESTS_PER_HOUR) {
    throw new AppError(
      429,
      "Too many requests, try again later",
      "OTP_RATE_LIMITED",
    );
  }
  const last = recent[0];
  if (last) {
    const waitMs = last.createdAt.getTime() + RESEND_COOLDOWN_MS - now;
    if (waitMs > 0) {
      throw new AppError(
        429,
        "Please wait before requesting a new code",
        "OTP_COOLDOWN",
        {
          retryAfterSeconds: Math.ceil(waitMs / 1000),
        },
      );
    }
  }

  // only the newest code may be used
  await prisma.otpCode.updateMany({
    where: { phone, consumedAt: null },
    data: { consumedAt: new Date() },
  });

  const code = randomInt(0, 1_000_000).toString().padStart(6, "0");
  const record = await prisma.otpCode.create({
    data: {
      phone,
      codeHash: hashCode(phone, code),
      expiresAt: new Date(now + CODE_TTL_MS),
    },
  });

  try {
    await smsProvider.send(phone, `کد ورود شما: ${code}`);
  } catch (err) {
    console.error("SMS send failed", err);
    await prisma.otpCode.delete({ where: { id: record.id } });
    throw new AppError(502, "Could not send the SMS", "SMS_FAILED");
  }

  return {
    retryAfterSeconds: RESEND_COOLDOWN_MS / 1000,
    expiresInSeconds: CODE_TTL_MS / 1000,
  };
}

export async function verifyOtp(phone: string, code: string) {
  const record = await prisma.otpCode.findFirst({
    where: { phone, consumedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
  if (!record) throw invalidCode();

  const { attempts } = await prisma.otpCode.update({
    where: { id: record.id },
    data: { attempts: { increment: 1 } },
    select: { attempts: true },
  });
  if (attempts > MAX_ATTEMPTS) {
    throw new AppError(
      429,
      "Too many wrong attempts, request a new code",
      "OTP_TOO_MANY_ATTEMPTS",
    );
  }

  const expected = Buffer.from(record.codeHash, "hex");
  const actual = Buffer.from(hashCode(phone, code), "hex");
  if (!timingSafeEqual(expected, actual)) throw invalidCode();

  // single use, safe against two concurrent verifications
  const { count } = await prisma.otpCode.updateMany({
    where: { id: record.id, consumedAt: null },
    data: { consumedAt: new Date() },
  });
  if (count !== 1) throw invalidCode();
}
