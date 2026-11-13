import { prisma } from "../../lib/db.js";
import { unauthorized } from "../../common/errors.js";
import type { ClientMeta } from "./auth.types.js";
import {
  REFRESH_TTL_MS,
  generateRefreshToken,
  hashToken,
  signAccessToken,
} from "./tokens.js";

export async function createSession(userId: string, meta: ClientMeta) {
  const refreshToken = generateRefreshToken();
  await prisma.session.create({
    data: {
      userId,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
      userAgent: meta.userAgent,
      ip: meta.ip,
    },
  });
  const accessToken = await signAccessToken(userId);
  return { accessToken, refreshToken };
}

/** Refresh-token rotation: the used token is revoked and a new one is issued. */
export async function rotateSession(refreshToken: string, meta: ClientMeta) {
  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(refreshToken) },
    include: { user: { select: { status: true } } },
  });

  if (
    !session ||
    session.revokedAt ||
    session.expiresAt < new Date() ||
    session.user.status === "SUSPENDED"
  ) {
    throw unauthorized();
  }

  const { count } = await prisma.session.updateMany({
    where: { id: session.id, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  if (count !== 1) throw unauthorized();

  return createSession(session.userId, meta);
}

export async function revokeSession(refreshToken: string) {
  await prisma.session.updateMany({
    where: { tokenHash: hashToken(refreshToken), revokedAt: null },
    data: { revokedAt: new Date() },
  });
}
