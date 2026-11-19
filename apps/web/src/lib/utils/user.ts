import type { AuthUser } from "@/lib/api/types";

/** For DISPLAY only (e.g. a "wholesale" badge). The API alone decides which prices are returned. */
export const isActiveWholesale = (user: AuthUser | null) =>
  user?.customerType === "WHOLESALE" && user.status === "ACTIVE";
