import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(4000),
  WEB_URL: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  UPLOADS_DIR: z.string().default("./uploads"),
  API_PUBLIC_URL: z.url(),
  JWT_ACCESS_SECRET: z.string().min(32),
  OTP_PEPPER: z.string().min(32),
  COOKIE_DOMAIN: z
    .string()
    .optional()
    .transform((v) => v || undefined),
  SMS_PROVIDER: z.enum(["console"]).default("console"),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error(
    "Invalid environment:\n" +
      parsed.error.issues
        .map((i) => `  ${i.path.join(".")}: ${i.message}`)
        .join("\n"),
  );
  process.exit(1);
}

export const env = parsed.data;
export const isProd = env.NODE_ENV === "production";
