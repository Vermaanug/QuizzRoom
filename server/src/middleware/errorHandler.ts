import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import AppError from "../errors/appError.js";

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (res.headersSent) {
    return next(error);
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (error.code === "P2002") {
      const field = Array.isArray(error.meta?.target)
        ? error.meta.target[0]
        : undefined;

      res.status(409).json({
        success: false,
        message: field
          ? `${field} already exists`
          : "Resource already exists",
        code: "DUPLICATE_RESOURCE",
        ...(field && {
          errors: {
            [field]: `${field} already exists`,
          },
        }),
      });

      return;
    }

    // Record not found
    if (error.code === "P2025") {
      res.status(404).json({
        success: false,
        message: "Resource not found",
        code: "RESOURCE_NOT_FOUND",
      });

      return;
    }
  }

  // Your custom application errors
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      code: error.code,
      ...(error.errors && {
        errors: error.errors,
      }),
    });

    return;
  }

  // Unexpected errors
  console.error(`${req.method} ${req.originalUrl}`, error);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    code: "INTERNAL_ERROR",
  });
};

export default errorHandler;