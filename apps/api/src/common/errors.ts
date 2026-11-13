export class AppError extends Error {
  constructor(
    public status: number,
    message: string,
    public code: string = "ERROR",
    public details?: unknown,
  ) {
    super(message);
  }
}

export const unauthorized = () =>
  new AppError(401, "Unauthorized", "UNAUTHORIZED");
