export function isTokenExpired(token: string, skewSeconds = 30): boolean {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1] ?? "", "base64url").toString("utf8"),
    );
    return (
      typeof payload.exp !== "number" ||
      payload.exp * 1000 - skewSeconds * 1000 <= Date.now()
    );
  } catch {
    return true;
  }
}
