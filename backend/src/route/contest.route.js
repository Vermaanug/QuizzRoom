import express from "express"
import authMiddleWare from "../middleware/auth.middleware.js";
import { createContest } from "../controllers/contest.controller.js"

const contestRouter = express.Router();

contestRouter.post("/createContest", authMiddleWare , createContest)

export default contestRouter;