import express from "express";
import { SignUp } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signup", SignUp);

export default authRouter;
