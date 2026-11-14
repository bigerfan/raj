import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Storage } from "./storage.js";

export class LocalStorage implements Storage {
  constructor(
    private readonly root: string, // absolute path
    private readonly publicBaseUrl: string,
  ) {}

  private resolve(key: string) {
    const full = path.resolve(this.root, key);
    if (!full.startsWith(this.root + path.sep))
      throw new Error("Invalid storage key");
    return full;
  }

  async put(key: string, data: Buffer) {
    const file = this.resolve(key);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, data);
  }

  async remove(key: string) {
    await rm(this.resolve(key), { force: true });
  }

  url(key: string) {
    return `${this.publicBaseUrl}/${key}`;
  }
}
