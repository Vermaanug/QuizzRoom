import { Response } from "express";
import AppError from "../errors/appError.js";
import { findQuizByIdAndOwner } from "../models/quizModel.js";
import {
    createRoom
} from "../models/roomModel.js";
import { AuthenticatedRequest } from "../types/index.js";

export const createRoomHandler = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const quizId = req.params.id;
  const hostUserId = req.user?.id;

  if (!hostUserId) {
    throw new AppError(
      "Unauthorized",
      401,
      "UNAUTHORIZED",
    );
  }

  const quiz = await findQuizByIdAndOwner(
    quizId,
    hostUserId,
  );

  if (!quiz) {
    throw new AppError(
      "Quiz not found",
      404,
      "QUIZ_NOT_FOUND",
    );
  }

  if (quiz.status !== "published") {
    throw new AppError(
      "Only published quizzes can be hosted",
      400,
      "QUIZ_NOT_PUBLISHED",
    );
  }

  const room = await createRoom({
    quizId,
    hostUserId,
    allowAnonymous: req.body.allowAnonymous ?? true,
  });

  return res.status(201).json({
    message: "Room created successfully",
    room,
  });
};

