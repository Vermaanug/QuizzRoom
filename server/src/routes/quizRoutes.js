import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import asyncHandler from "../middleware/asyncHandler.js";
import {
  createQuizHandler,
  deleteQuizHandler,
  getQuizzesHandler,
  updateQuizHandler,
} from "../controllers/quizController.js";

const quizRouter = express.Router();

quizRouter.use(asyncHandler(authMiddleware));

quizRouter.get("/", asyncHandler(getQuizzesHandler));
quizRouter.post("/", asyncHandler(createQuizHandler));
quizRouter.patch("/:id", asyncHandler(updateQuizHandler));
quizRouter.delete("/:id", asyncHandler(deleteQuizHandler));

export default quizRouter;
