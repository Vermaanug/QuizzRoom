import express from "express"
import authMiddleWare from "../middleware/auth.middleware.js";
import { createContest, addQuestions, getAllContest } from "../controllers/contest.controller.js"

const contestRouter = express.Router();

contestRouter.post("/createContest", authMiddleWare , createContest)
contestRouter.post("/addQuestions/:id" , authMiddleWare , addQuestions)
contestRouter.get("/getAllContest" , authMiddleWare, getAllContest)

export default contestRouter;