import express from "express";
import { GetCurrentUser, Login, SignUp } from "../controllers/auth.controller.js";
import authMiddleWare from "../middleware/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/signup", SignUp);
authRouter.post("/login", Login);
authRouter.get("/me", authMiddleWare, GetCurrentUser);

export default authRouter;
