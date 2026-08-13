import express, { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import asyncHandler from "../middleware/asyncHandler.js";
import {
  createQuizHandler,
  deleteQuizHandler,
  getQuizzesHandler,
  updateQuizHandler,
  getSingleQuizHandler
} from "../controllers/quizController.js";

const quizRouter: Router = express.Router();

quizRouter.use(asyncHandler(authMiddleware));

quizRouter.get("/", asyncHandler(getQuizzesHandler));
quizRouter.get("/:id", asyncHandler(getSingleQuizHandler));
quizRouter.post("/", asyncHandler(createQuizHandler));
quizRouter.patch("/:id", asyncHandler(updateQuizHandler));
quizRouter.delete("/:id", asyncHandler(deleteQuizHandler));

export default quizRouter;
