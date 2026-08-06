import jwt from "jsonwebtoken";
import validateSignUpData from "../utils/validateSignUpData.js";
import UserModel from "../models/userModel.js";
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
  const existingUser = await UserModel.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new AppError(
      "Username or email already exists",
      409,
      "USER_ALREADY_EXISTS",
    );
  }

  await UserModel.create({ firstName, lastName, username, email, password });

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

  const query = username.includes("@")
    ? { email: username }
    : { username };
  const user = await UserModel.findOne(query).select("+password");

  if (!user || !(await user.validatePassword(password))) {
    throw new AppError("Invalid username or password", 401, "INVALID_CREDENTIALS");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
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
      id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      username: req.user.username,
      email: req.user.email,
    },
  });
};
