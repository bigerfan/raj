import type { SmsProvider } from "./sms.provider.js";

export class ConsoleSmsProvider implements SmsProvider {
  async send(phone: string, message: string) {
    console.log(`[SMS → ${phone}] ${message}`);
  }
}
