import express from "express";
import { getCurrentUser, login, signUp } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import asyncHandler from "../middleware/asyncHandler.js";

const authRouter = express.Router();

authRouter.post("/signup", asyncHandler(signUp));
authRouter.post("/login", asyncHandler(login));
authRouter.get(
  "/me",
  asyncHandler(authMiddleware),
  asyncHandler(getCurrentUser),
);

export default authRouter;
