import express, { Router } from "express";
import {
  getCurrentUser,
  login,
  logout,
  signUp,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import asyncHandler from "../middleware/asyncHandler.js";

const authRouter: Router = express.Router();

authRouter.post("/signup", asyncHandler(signUp));
authRouter.post("/login", asyncHandler(login));
authRouter.post("/logout", asyncHandler(logout));
authRouter.get(
  "/me",
  asyncHandler(authMiddleware),
  asyncHandler(getCurrentUser)
);

export default authRouter;
