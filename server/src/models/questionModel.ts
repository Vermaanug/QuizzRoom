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


export const saveQuizQuestionsByOwner = async (
  quizId: string,
  ownerId: string,
  questions: QuestionInput[]
): Promise<MappedQuestion[]> => {
  const quiz = await prisma.quiz.findFirst({ where: { id: quizId, ownerId } });
  if (!quiz) {
    throw new AppError("Quiz not found", 404, "QUIZ_NOT_FOUND");
  }

  const savedQuestions = await prisma.$transaction(
    async (transaction) => {
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

      const questionsToUpdate: { id: string; data: Omit<ReturnType<typeof buildQuestionFields>, never> }[] = [];
      const questionsToCreate: ReturnType<typeof buildQuestionFields>[] = [];

      function buildQuestionFields(incomingQuestion: QuestionInput) {
        return {
          text: incomingQuestion.text.trim(),
          codeSnippet: incomingQuestion.codeSnippet?.trim() || null,
          optionA: incomingQuestion.optionA.trim(),
          optionB: incomingQuestion.optionB.trim(),
          optionC: incomingQuestion.optionC.trim(),
          optionD: incomingQuestion.optionD.trim(),
          correctOption: incomingQuestion.correctOption,
          timeLimitSeconds: Number(incomingQuestion.timeLimitSeconds),
          orderIndex: 0, // set below once we know the final position
        };
      }

      questions.forEach((incomingQuestion, positionInArray) => {
        const questionFields = {
          ...buildQuestionFields(incomingQuestion),
          orderIndex: positionInArray,
        };

        const isExistingQuestion =
          incomingQuestion.id && currentQuestionIds.has(incomingQuestion.id);

        if (isExistingQuestion) {
          questionsToUpdate.push({ id: incomingQuestion.id as string, data: questionFields });
        } else {
          questionsToCreate.push(questionFields);
        }
      });

      await Promise.all(
        questionsToUpdate.map(({ id, data }) =>
          transaction.question.update({ where: { id }, data })
        )
      );

      if (questionsToCreate.length > 0) {
        await transaction.question.createMany({
          data: questionsToCreate.map((questionFields) => ({ ...questionFields, quizId })),
        });
      }

      return transaction.question.findMany({
        where: { quizId },
        orderBy: { orderIndex: "asc" },
      });
    },
    { timeout: 15000, maxWait: 5000 }
  );

  return savedQuestions.map(mapQuestion).filter((q) => q !== null) as MappedQuestion[];
};