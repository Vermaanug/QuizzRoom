import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/index.js";
import AppError from "../errors/appError.js";
import jwt from "jsonwebtoken";
import { findUserById } from "../models/userModel.js";
import { User } from "@prisma/client";

interface DecodedToken {
  id: string;
}

const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next?: NextFunction
): Promise<void> => {
  const { token } = req.cookies;

  if (!token) {
    throw new AppError(
      "Authentication required",
      401,
      "AUTHENTICATION_REQUIRED"
    );
  }

  let decodedToken: DecodedToken;
  try {
    decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as DecodedToken;
  } catch {
    throw new AppError("Invalid or expired token", 401, "INVALID_TOKEN");
  }

  const user = await findUserById(decodedToken.id);
  if (!user) {
    throw new AppError("User not found", 401, "USER_NOT_FOUND");
  }

  req.user = user as User;
  if (next) {
    return next();
  }
};

export default authMiddleware;
