import type { AccountStatus, CustomerType } from "../lib/db.js";

/**
 * The single place that decides which price list a user sees.
 * Wholesale needs BOTH the customer type and an active (approved) account;
 * a pending applicant still sees retail prices.
 */
export function resolveAudience(user?: {
  customerType: CustomerType;
  status: AccountStatus;
}): CustomerType {
  return user?.customerType === "WHOLESALE" && user.status === "ACTIVE"
    ? "WHOLESALE"
    : "RETAIL";
}
