import { QuizStatus } from "@prisma/client";
import { prisma } from "../db/prisma.js";
import AppError from "../errors/appError.js";
import { MappedQuiz, UpdateQuizRequest } from "../types/index.js";

type QuizFilter = "all" | QuizStatus;

const mapQuiz = (quiz: any): MappedQuiz | null => {
  if (!quiz) return null;

  return {
    id: quiz.id,
    title: quiz.title,
    status: quiz.status,
    ownerId: quiz.ownerId,
    questionCount: quiz._count.questions,
    createdAt: quiz.createdAt,
    updatedAt: quiz.updatedAt,
  };
};

export const createQuiz = async ({
  ownerId,
  title,
  status = "draft",
}: {
  ownerId: string;
  title: string;
  status?: "draft" | "published" | "archived";
}): Promise<MappedQuiz> => {
  const quiz = await prisma.quiz.create({
    data: {
      ownerId,
      title: title.trim(),
      status,
    },
  });

  return mapQuiz(quiz)!;
};

export const findQuizById = async (id: string): Promise<MappedQuiz | null> => {
  const quiz = await prisma.quiz.findUnique({
    where: { id },
  });

  return mapQuiz(quiz);
};

export const findQuizByIdAndOwner = async (
  id: string,
  ownerId: string
): Promise<MappedQuiz | null> => {
  const quiz = await prisma.quiz.findFirst({
    where: { id, ownerId },
  });

  return mapQuiz(quiz);
};

export const findQuizzesByOwner = async (
  ownerId: string,
  type: QuizFilter = "all"
): Promise<MappedQuiz[]> => {
  const quizzes = await prisma.quiz.findMany({
    where: {
      ownerId,
      ...(type !== "all" && {
        status: type,
      }),
    },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    include:{
      _count: {
        select: {
          questions: true,
        }
      }
    }
  });

  return quizzes.map(mapQuiz).filter((q) => q !== null) as MappedQuiz[];
};

export const updateQuizByIdAndOwner = async (
  id: string,
  ownerId: string,
  data: UpdateQuizRequest
): Promise<MappedQuiz> => {
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

  return mapQuiz(updatedQuiz)!;
};

export const deleteQuizByIdAndOwner = async (
  id: string,
  ownerId: string
): Promise<void> => {
  const quiz = await prisma.quiz.findFirst({
    where: { id, ownerId },
  });

  if (!quiz) {
    throw new AppError("Quiz not found", 404, "QUIZ_NOT_FOUND");
  }

  await prisma.quiz.delete({
    where: { id: quiz.id },
  });
};
