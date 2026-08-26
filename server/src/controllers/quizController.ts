import { Response } from "express";
import AppError from "../errors/appError.js";
import validateQuizData from "../utils/validateQuizData.js";
import {
  createQuiz,
  deleteQuizByIdAndOwner,
  findQuizByIdAndOwner,
  findQuizzesByOwner,
  publishQuizByOwner,
  updateQuizByIdAndOwner,
} from "../models/quizModel.js";
import { AuthenticatedRequest } from "../types/index.js";
import { generateQuizQuestions } from "../services/quizGenerator.js";
import { saveQuizQuestionsByOwner } from "../models/questionModel.js";

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

export const publishQuizHandler = async (req: AuthenticatedRequest , res: Response) => {
  const { quizID } = req.params;
  const ownerId = req?.user?.id as string;

  const quiz = await publishQuizByOwner(quizID, ownerId);
  res.json(quiz);
}

export const generateQuizHandler = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const ownerId = req.user?.id as string;
  const { prompt, questionCount, title } = req.body as {
    prompt?: string;
    questionCount?: number;
    title?: string;
  };
 
  if (typeof prompt !== "string" || prompt.trim().length === 0) {
    throw new AppError("A prompt is required", 400, "VALIDATION_ERROR");
  }
 
  const count = Number(questionCount) || 20;
 
  const quiz = await createQuiz({
    ownerId,
    title: (title?.trim() || prompt.trim().slice(0, 100)),
    status: "draft",
  });
 
  let questions;
  try {
    questions = await generateQuizQuestions(prompt.trim(), count);
  } catch (error) {
    // The quiz shell already exists (so it's not lost — host can retry
    // generation or write questions manually from the editor) but the
    // request itself failed, so surface that clearly.
    throw new AppError(
      error instanceof Error ? error.message : "Failed to generate questions",
      502,
      "AI_GENERATION_FAILED",
    );
  }
 
  const savedQuestions = await saveQuizQuestionsByOwner(quiz.id, ownerId, questions);
 
  res.status(201).json({
    success: true,
    message: `Generated ${savedQuestions.length} questions`,
    quiz,
    questions: savedQuestions,
  });
};