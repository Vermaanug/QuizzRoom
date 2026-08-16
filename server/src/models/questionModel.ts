import { prisma } from "../db/prisma.js";
import AppError from "../errors/appError.js";
import { MappedQuestion, QuestionInput } from "../types/index.js";

const mapQuestion = (question: any): MappedQuestion | null => {
  if (!question) return null;

  return {
    id: question.id,
    quizId: question.quizId,
    text: question.text,
    codeSnippet: question.codeSnippet,
    optionA: question.optionA,
    optionB: question.optionB,
    optionC: question.optionC,
    optionD: question.optionD,
    correctOption: question.correctOption,
    timeLimitSeconds: question.timeLimitSeconds,
    orderIndex: question.orderIndex,
    createdAt: question.createdAt,
    updatedAt: question.updatedAt,
  };
};

export const findQuestionsByQuizAndOwner = async (
  quizId: string,
  ownerId: string
): Promise<MappedQuestion[]> => {
  const quiz = await prisma.quiz.findFirst({ where: { id: quizId, ownerId } });
  if (!quiz) {
    throw new AppError("Quiz not found", 404, "QUIZ_NOT_FOUND");
  }

  const questions = await prisma.question.findMany({
    where: { quizId },
    orderBy: { orderIndex: "asc" },
  });

  return questions.map(mapQuestion).filter((q) => q !== null) as MappedQuestion[];
};

/**
 * Diff-and-replace the full question set for a quiz in one transaction:
 * - incoming items with a recognized id are updated
 * - incoming items without one (or with an unrecognized id) are created
 * - any existing question NOT present in the incoming array is deleted
 * orderIndex is always derived from array position, never trusted from the client.
 */
export const saveQuizQuestionsByOwner = async (
  quizId: string,
  ownerId: string,
  questions: QuestionInput[]
): Promise<MappedQuestion[]> => {
  const quiz = await prisma.quiz.findFirst({ where: { id: quizId, ownerId } });
  if (!quiz) {
    throw new AppError("Quiz not found", 404, "QUIZ_NOT_FOUND");
  }

  const savedQuestions = await prisma.$transaction(async (transaction) => {

    const questionsCurrentlyInDb = await transaction.question.findMany({
      where: { quizId },
      select: { id: true },
    });

    const currentQuestionIds = new Set(questionsCurrentlyInDb.map((q) => q.id));

    const questionIdsSentByClient = new Set(
      questions
        .filter((question): question is QuestionInput & { id: string } => Boolean(question.id))
        .map((question) => question.id)
    );

    const removedQuestionIds = [...currentQuestionIds].filter(
      (id) => !questionIdsSentByClient.has(id)
    );

    if (removedQuestionIds.length > 0) {
      await transaction.question.deleteMany({ where: { id: { in: removedQuestionIds } } });
    }

    for (const [positionInArray, incomingQuestion] of questions.entries()) {
      const questionFields = {
        text: incomingQuestion.text.trim(),
        codeSnippet: incomingQuestion.codeSnippet?.trim() || null,
        optionA: incomingQuestion.optionA.trim(),
        optionB: incomingQuestion.optionB.trim(),
        optionC: incomingQuestion.optionC.trim(),
        optionD: incomingQuestion.optionD.trim(),
        correctOption: incomingQuestion.correctOption,
        timeLimitSeconds: Number(incomingQuestion.timeLimitSeconds),
        orderIndex: positionInArray,
      };

      const isExistingQuestion =
        incomingQuestion.id && currentQuestionIds.has(incomingQuestion.id);

      if (isExistingQuestion) {
        await transaction.question.update({
          where: { id: incomingQuestion.id },
          data: questionFields,
        });
      } else {
        await transaction.question.create({
          data: { ...questionFields, quizId },
        });
      }
    }

    return transaction.question.findMany({
      where: { quizId },
      orderBy: { orderIndex: "asc" },
    });
  });

  return savedQuestions.map(mapQuestion).filter((q) => q !== null) as MappedQuestion[];
};



