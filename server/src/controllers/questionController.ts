import type { Response } from "express";
import type { AuthenticatedRequest } from "../types/index.js";

import * as questionModel from "../models/questionModel.js";
import type { QuestionInput } from "../types/index.js";
import validateBulkSaveQuestions from "../utils/validateBulkSaveQuestions.js";

export const getQuizQuestionsHandler = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { quizId } = req.params;
  const ownerId = req?.user?.id as string;

  const questions = await questionModel.findQuestionsByQuizAndOwner(
    quizId,
    ownerId,
  );
  res.json(questions);
};

// PUT /api/quizzes/:quizId/questions
// Called once, when the host clicks Save/Publish on the Quiz Editor —
// sends the entire current questions array from useFieldArray.
export const bulkSaveQuestionsHandler = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { isValid, errors } = validateBulkSaveQuestions(req);
  if (!isValid) {
    return res.status(400).json({ success: false, errors });
  }

  const { quizID } = req.params;
  const ownerId = req?.user?.id as string;
  const { questions } = req.body as { questions: QuestionInput[] };

  const saved = await questionModel.saveQuizQuestionsByOwner(
    quizID,
    ownerId,
    questions,
  );
  res.json(saved);
};
