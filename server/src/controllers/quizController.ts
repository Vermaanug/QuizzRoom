import { Response } from "express";
import AppError from "../errors/appError.js";
import validateQuizData from "../utils/validateQuizData.js";
import {
  createQuiz,
  deleteQuizByIdAndOwner,
  findQuizByIdAndOwner,
  findQuizzesByOwner,
  updateQuizByIdAndOwner,
} from "../models/quizModel.js";
import { AuthenticatedRequest } from "../types/index.js";

const normalizeQuizBody = (body: any) => ({
  title: body.title,
  status: body.status,
});

export const createQuizHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { isValid, errors } = validateQuizData(req);

  if (!isValid) {
    throw new AppError("Validation failed", 400, "VALIDATION_ERROR", errors);
  }

  try {
    const quiz = await createQuiz({
      ownerId: req.user?.id as string,
      ...normalizeQuizBody(req.body),
      status: req.body.status || "draft",
    });

    res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      quiz,
    });
  } catch (error) {
    throw error;
  }
};

export const getQuizzesHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const type = (req.query.type as "all" | "published" | "draft") || "all";

  const quizzes = await findQuizzesByOwner(
    req.user?.id as string,
    type
  );
  

  res.json({
    success: true,
    quizzes,
  });
};

export const updateQuizHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { isValid, errors } = validateQuizData(req, { partial: true });

  if (!isValid) {
    throw new AppError("Validation failed", 400, "VALIDATION_ERROR", errors);
  }

  try {
    const quiz = await updateQuizByIdAndOwner(
      req.params.id,
      req.user?.id as string,
      normalizeQuizBody(req.body)
    );

    res.json({
      success: true,
      message: "Quiz updated successfully",
      quiz,
    });
  } catch (error) {
    throw error;
  }
};

export const deleteQuizHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  await deleteQuizByIdAndOwner(req.params.id, req.user?.id as string);

  res.json({
    success: true,
    message: "Quiz deleted successfully",
  });
};

export const getSingleQuizHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const quiz = await findQuizByIdAndOwner(req.params.id, req.user?.id as string);

  if (!quiz) {
    throw new AppError("Quiz not found", 404, "QUIZ_NOT_FOUND");
  }

  res.json({
    success: true,
    quiz,
  });
}