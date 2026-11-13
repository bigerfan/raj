import { env, isProd } from "../../../config/env.js";
import { ConsoleSmsProvider } from "./console.provider.js";
import type { SmsProvider } from "./sms.provider.js";

function createProvider(): SmsProvider {
  if (isProd && env.SMS_PROVIDER === "console") {
    throw new Error("The console SMS provider cannot be used in production");
  }
  return new ConsoleSmsProvider();
}

export const smsProvider = createProvider();
