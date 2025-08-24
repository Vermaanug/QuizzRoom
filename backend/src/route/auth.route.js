import express from "express";
import { Login, SignUp } from "../controllers/auth.controller.js";
import { createRoom } from "../controllers/contestController.js";

const authRouter = express.Router();

authRouter.post("/signup", SignUp);
authRouter.post("/login", Login);
authRouter.post("/createRoom", createRoom)

export default authRouter;
