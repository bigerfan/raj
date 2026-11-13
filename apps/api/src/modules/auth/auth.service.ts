import { prisma } from "../../lib/db.js";
import { AppError } from "../../common/errors.js";
import { authUserSelect, type ClientMeta } from "./auth.types.js";
import { verifyOtp } from "./otp.service.js";
import { createSession } from "./session.service.js";

export async function loginWithOtp(
  phone: string,
  code: string,
  meta: ClientMeta,
) {
  await verifyOtp(phone, code);

  // login and registration are the same flow
  const user = await prisma.user.upsert({
    where: { phone },
    update: {},
    create: { phone },
    select: authUserSelect,
  });

  if (user.status === "SUSPENDED") {
    throw new AppError(403, "This account is suspended", "ACCOUNT_SUSPENDED");
  }

  const tokens = await createSession(user.id, meta);
  return { user, tokens };
}
