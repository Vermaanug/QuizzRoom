import { Request, Response, NextFunction } from "express";
import AppError from "../errors/appError.js";

const notFound = (req: Request, res: Response, next: NextFunction): void => {
  next(
    new AppError(
      `Route not found: ${req.method} ${req.originalUrl}`,
      404,
      "ROUTE_NOT_FOUND"
    )
  );
};

export default notFound;
