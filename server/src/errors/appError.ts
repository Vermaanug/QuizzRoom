export class AppError extends Error {
  name: string = "AppError";
  isOperational: boolean = true;

  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = "INTERNAL_ERROR",
    public errors?: Record<string, string>
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
