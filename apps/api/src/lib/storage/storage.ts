export interface Storage {
  put(key: string, data: Buffer): Promise<void>;
  remove(key: string): Promise<void>;
  /** Public URL for a key. The DB only ever stores keys. */
  url(key: string): string;
}
