import { prisma } from "../db/prisma.js";
import AppError from "../errors/appError.js";

const mapQuiz = (quiz) => {
  if (!quiz) return null;

  return {
    id: quiz.id,
    title: quiz.title,
    status: quiz.status,
    ownerId: quiz.ownerId,
    createdAt: quiz.createdAt,
    updatedAt: quiz.updatedAt,
  };
};

export const createQuiz = async ({ ownerId, title, status = "draft" }) => {
  const quiz = await prisma.quiz.create({
    data: {
      ownerId,
      title: title.trim(),
      status,
    },
  });

  return mapQuiz(quiz);
};

export const findQuizById = async (id) => {
  const quiz = await prisma.quiz.findUnique({
    where: { id },
  });

  return mapQuiz(quiz);
};

export const findQuizByIdAndOwner = async (id, ownerId) => {
  const quiz = await prisma.quiz.findFirst({
    where: { id, ownerId },
  });

  return mapQuiz(quiz);
};

export const findQuizzesByOwner = async (ownerId) => {
  const quizzes = await prisma.quiz.findMany({
    where: { ownerId },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
  });

  return quizzes.map(mapQuiz);
};

export const updateQuizByIdAndOwner = async (id, ownerId, data) => {
  const quiz = await prisma.quiz.findFirst({
    where: { id, ownerId },
  });

  if (!quiz) {
    throw new AppError("Quiz not found", 404, "QUIZ_NOT_FOUND");
  }

  const updatedQuiz = await prisma.quiz.update({
    where: { id: quiz.id },
    data: {
      ...(data.title !== undefined && { title: data.title.trim() }),
      ...(data.status !== undefined && { status: data.status }),
    },
  });

  return mapQuiz(updatedQuiz);
};

export const deleteQuizByIdAndOwner = async (id, ownerId) => {
  const quiz = await prisma.quiz.findFirst({
    where: { id, ownerId },
  });

  if (!quiz) {
    throw new AppError("Quiz not found", 404, "QUIZ_NOT_FOUND");
  }

  await prisma.quiz.delete({
    where: { id: quiz.id },
  });

  return mapQuiz(quiz);
};
