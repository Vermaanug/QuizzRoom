import express, { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import asyncHandler from "../middleware/asyncHandler.js";
import {
  createQuizHandler,
  deleteQuizHandler,
  getQuizzesHandler,
  updateQuizHandler,
  getSingleQuizHandler,
  publishQuizHandler,
  generateQuizHandler,
} from "../controllers/quizController.js";
import { bulkSaveQuestionsHandler, getQuizQuestionsHandler } from "../controllers/questionController.js";
import { createRoomHandler } from "../controllers/roomController.js";

const quizRouter: Router = express.Router();

quizRouter.use(asyncHandler(authMiddleware));

quizRouter.get("/", asyncHandler(getQuizzesHandler));
quizRouter.get("/:id", asyncHandler(getSingleQuizHandler));
quizRouter.post("/", asyncHandler(createQuizHandler));
quizRouter.patch("/:id", asyncHandler(updateQuizHandler));
quizRouter.delete("/:id", asyncHandler(deleteQuizHandler));
quizRouter.post("/:id/publish", asyncHandler(publishQuizHandler));
quizRouter.post("/:id/rooms" , asyncHandler(createRoomHandler))
quizRouter.post("/generate", asyncHandler(generateQuizHandler));

//Questions
quizRouter.get("/:quizID/questions" , asyncHandler(getQuizQuestionsHandler))
quizRouter.put("/:quizID/questions" , asyncHandler(bulkSaveQuestionsHandler))


export default quizRouter;
