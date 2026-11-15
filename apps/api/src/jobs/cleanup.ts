import { prisma } from "../lib/db.js";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

// OTP rows younger than 1 hour are needed by the per-phone rate limit in otp.service.ts,
// so retention must stay well above that.
const OTP_RETENTION_MS = DAY;
const REVOKED_SESSION_RETENTION_MS = 7 * DAY;

export async function runCleanup() {
  const now = Date.now();

  const otpCodes = await prisma.otpCode.deleteMany({
    where: { createdAt: { lt: new Date(now - OTP_RETENTION_MS) } },
  });
  const expiredSessions = await prisma.session.deleteMany({
    where: { expiresAt: { lt: new Date(now) } },
  });
  const revokedSessions = await prisma.session.deleteMany({
    where: { revokedAt: { lt: new Date(now - REVOKED_SESSION_RETENTION_MS) } },
  });

  return {
    otpCodes: otpCodes.count,
    expiredSessions: expiredSessions.count,
    revokedSessions: revokedSessions.count,
  };
}
