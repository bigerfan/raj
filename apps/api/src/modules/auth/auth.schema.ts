import { z } from "zod";
import { normalizePhone, toLatinDigits } from "./phone.js";

const phoneSchema = z.string().transform((v, ctx) => {
  const phone = normalizePhone(v);
  if (!phone) {
    ctx.addIssue({ code: "custom", message: "Invalid phone number" });
    return z.NEVER;
  }
  return phone;
});

const codeSchema = z
  .string()
  .transform((v) => toLatinDigits(v).trim())
  .pipe(z.string().regex(/^\d{6}$/, "Code must be 6 digits"));

export const requestOtpSchema = z.object({ phone: phoneSchema });
export const verifyOtpSchema = z.object({
  phone: phoneSchema,
  code: codeSchema,
});
