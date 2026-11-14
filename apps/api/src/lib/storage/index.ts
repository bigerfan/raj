import path from "node:path";
import { env } from "../../config/env.js";
import { LocalStorage } from "./local.storage.js";

export const uploadsRoot = path.resolve(env.UPLOADS_DIR);
export const storage = new LocalStorage(
  uploadsRoot,
  `${env.API_PUBLIC_URL}/uploads`,
);
