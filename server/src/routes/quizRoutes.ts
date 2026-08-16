import express, { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import asyncHandler from "../middleware/asyncHandler.js";
import {
  createQuizHandler,
  deleteQuizHandler,
  getQuizzesHandler,
  updateQuizHandler,
  getSingleQuizHandler,
} from "../controllers/quizController.js";
import { bulkSaveQuestionsHandler, getQuizQuestionsHandler } from "../controllers/questionController.js";

const quizRouter: Router = express.Router();

quizRouter.use(asyncHandler(authMiddleware));

quizRouter.get("/", asyncHandler(getQuizzesHandler));
quizRouter.get("/:id", asyncHandler(getSingleQuizHandler));
quizRouter.post("/", asyncHandler(createQuizHandler));
quizRouter.patch("/:id", asyncHandler(updateQuizHandler));
quizRouter.delete("/:id", asyncHandler(deleteQuizHandler));

//Questions
quizRouter.post("/:id/questions" , asyncHandler(getQuizQuestionsHandler))
quizRouter.put("/:id/questions" , asyncHandler(bulkSaveQuestionsHandler))


export default quizRouter;
