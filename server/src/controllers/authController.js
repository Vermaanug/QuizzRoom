import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import validateSignUpData from "../utils/validateSignUpData.js";
import {
  createUser,
  findUserByUsernameOrEmail,
  findUserForLogin,
} from "../models/userModel.js";
import AppError from "../errors/appError.js";

const authCookieOptions = {
  httpOnly: true,
  path: "/",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  secure: process.env.NODE_ENV === "production",
};

export const signUp = async (req, res) => {
  const { isValid, errors } = validateSignUpData(req);

  if (!isValid) {
    throw new AppError("Validation failed", 400, "VALIDATION_ERROR", errors);
  }

  const { firstName, lastName, username, email, password } = req.body;
  const existingUser = await findUserByUsernameOrEmail(username, email);

  if (existingUser) {
    throw new AppError(
      "Username or email already exists",
      409,
      "USER_ALREADY_EXISTS",
    );
  }

  try {
    await createUser({ firstName, lastName, username, email, password });
  } catch (error) {
    if (error.code === "23505") {
      throw new AppError(
        "Username or email already exists",
        409,
        "USER_ALREADY_EXISTS",
      );
    }

    throw error;
  }

  return res.status(201).json({
    success: true,
    message: "User created successfully",
  });
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    const errors = {};
    if (!username) errors.username = "Username is required";
    if (!password) errors.password = "Password is required";
    throw new AppError("Validation failed", 400, "VALIDATION_ERROR", errors);
  }

  const user = await findUserForLogin(username);

  if (!user || !(await bcryptjs.compare(password, user.passwordHash))) {
    throw new AppError("Invalid username or password", 401, "INVALID_CREDENTIALS");
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "8h",
  });

  res.cookie("token", token, {
    ...authCookieOptions,
    maxAge: 8 * 60 * 60 * 1000,
  });

  return res.json({ success: true, message: "Login successful" });
};

export const logout = async (req, res) => {
  res.clearCookie("token", authCookieOptions);

  return res.json({
    success: true,
    message: "Logged out successfully",
  });
};

export const getCurrentUser = async (req, res) => {
  return res.json({
    success: true,
    user: {
      id: req.user.id,
      first_name: req.user.firstName,
      last_name: req.user.lastName,
      username: req.user.username,
      email: req.user.email,
    },
  });
};
