import type { AuthUser, RequestOtpResult } from "../types";
import { clientFetch } from "./fetch";

export const requestOtp = (phone: string) =>
  clientFetch<RequestOtpResult>("/auth/otp/request", {
    method: "POST",
    body: { phone },
  });

export const verifyOtp = (phone: string, code: string) =>
  clientFetch<{ user: AuthUser }>("/auth/otp/verify", {
    method: "POST",
    body: { phone, code },
  });

export const logout = () =>
  clientFetch<void>("/auth/logout", { method: "POST" });
