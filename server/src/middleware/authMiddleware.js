import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";
import AppError from "../errors/appError.js";

const authMiddleware = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    throw new AppError(
      "Authentication required",
      401,
      "AUTHENTICATION_REQUIRED",
    );
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch {
    throw new AppError("Invalid or expired token", 401, "INVALID_TOKEN");
  }

  const user = await UserModel.findById(decodedToken.id);
  if (!user) {
    throw new AppError("User not found", 401, "USER_NOT_FOUND");
  }

  req.user = user;
  return next();
};

export default authMiddleware;
