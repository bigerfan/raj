import { prisma } from "../../lib/db.js";

export const authUserSelect = {
  id: true,
  phone: true,
  name: true,
  role: true,
  customerType: true,
  status: true,
} as const;

export const findAuthUser = (id: string) =>
  prisma.user.findUnique({ where: { id }, select: authUserSelect });

export type AuthUser = NonNullable<Awaited<ReturnType<typeof findAuthUser>>>;

export interface ClientMeta {
  userAgent?: string;
  ip?: string;
}
