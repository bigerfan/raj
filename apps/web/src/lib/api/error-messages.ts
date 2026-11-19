import { isApiError } from "./errors";

const MESSAGES: Record<string, string> = {
  NETWORK_ERROR: "ارتباط با سرور برقرار نشد. اتصال اینترنت خود را بررسی کنید.",
  INTERNAL: "مشکلی در سرور رخ داد. لطفاً دوباره تلاش کنید.",
  HTTP_ERROR: "مشکلی پیش آمد. لطفاً دوباره تلاش کنید.",
  RATE_LIMITED: "تعداد درخواست‌ها زیاد است. کمی بعد دوباره تلاش کنید.",
  VALIDATION_ERROR: "اطلاعات واردشده معتبر نیست.",
  UNAUTHORIZED: "برای ادامه وارد حساب کاربری شوید.",
  FORBIDDEN: "شما به این بخش دسترسی ندارید.",
  ACCOUNT_SUSPENDED: "حساب کاربری شما مسدود شده است.",
  OTP_INVALID: "کد واردشده نادرست است یا منقضی شده است.",
  OTP_COOLDOWN: "لطفاً کمی صبر کنید و دوباره درخواست کد بدهید.",
  OTP_RATE_LIMITED: "تعداد درخواست‌های کد زیاد است. کمی بعد دوباره تلاش کنید.",
  OTP_TOO_MANY_ATTEMPTS: "تعداد تلاش‌های ناموفق زیاد بود. کد جدید دریافت کنید.",
  SMS_FAILED: "ارسال پیامک ناموفق بود. دوباره تلاش کنید.",
  PRODUCT_NOT_FOUND: "محصول مورد نظر پیدا نشد.",
  CATEGORY_NOT_FOUND: "دسته‌بندی مورد نظر پیدا نشد.",
};

export function getErrorMessage(
  err: unknown,
  fallback = MESSAGES.HTTP_ERROR,
): string {
  if (isApiError(err)) return MESSAGES[err.code] ?? fallback;
  return fallback;
}
