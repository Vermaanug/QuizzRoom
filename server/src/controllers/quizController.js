import AppError from "../errors/appError.js";
import validateQuizData from "../utils/validateQuizData.js";
import {
  createQuiz,
  deleteQuizByIdAndOwner,
  findQuizzesByOwner,
  updateQuizByIdAndOwner,
} from "../models/quizModel.js";

const normalizeQuizBody = (body) => ({
  title: body.title,
  status: body.status,
});

export const createQuizHandler = async (req, res) => {
  const { isValid, errors } = validateQuizData(req);

  if (!isValid) {
    throw new AppError("Validation failed", 400, "VALIDATION_ERROR", errors);
  }

  try {
    const quiz = await createQuiz({
      ownerId: req.user.id,
      ...normalizeQuizBody(req.body),
      status: req.body.status || "draft",
    });

    return res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      quiz,
    });
  } catch (error) {
    throw error;
  }
};

export const getQuizzesHandler = async (req, res) => {
  const quizzes = await findQuizzesByOwner(req.user.id);

  return res.json({
    success: true,
    quizzes,
  });
};

export const updateQuizHandler = async (req, res) => {
  const { isValid, errors } = validateQuizData(req, { partial: true });

  if (!isValid) {
    throw new AppError("Validation failed", 400, "VALIDATION_ERROR", errors);
  }

  try {
    const quiz = await updateQuizByIdAndOwner(
      req.params.id,
      req.user.id,
      normalizeQuizBody(req.body),
    );

    return res.json({
      success: true,
      message: "Quiz updated successfully",
      quiz,
    });
  } catch (error) {
    throw error;
  }
};

export const deleteQuizHandler = async (req, res) => {
  await deleteQuizByIdAndOwner(req.params.id, req.user.id);

  return res.json({
    success: true,
    message: "Quiz deleted successfully",
  });
};
