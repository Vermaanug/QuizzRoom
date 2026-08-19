import { Response } from "express";
import AppError from "../errors/appError.js";
import { findQuizByIdAndOwner, findQuizById } from "../models/quizModel.js";
import {
  createRoom,
  findRoomByInviteToken,
} from "../models/roomModel.js";
import {
  createParticipant,
  findParticipantByRoomAndUser,
  countParticipantsByRoomId,
} from "../models/participantModel.js";
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

export const getRoomByTokenHandler = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { token } = req.params;

  const room = await findRoomByInviteToken(token);

  if (!room) {
    throw new AppError(
      "Room not found",
      404,
      "ROOM_NOT_FOUND",
    );
  }

  const quiz = await findQuizById(room.quizId);
  const participantCount = await countParticipantsByRoomId(room.id);

  return res.status(200).json({
    room: {
      id: room.id,
      inviteToken: room.inviteToken,
      status: room.status,
      allowAnonymous: room.allowAnonymous,
      quizTitle: quiz?.title ?? null,
      participantCount,
    },
  });
};


export const joinRoomHandler = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { token } = req.params;
  const { displayName } = req.body;

  const room = await findRoomByInviteToken(token);

  if (!room) {
    throw new AppError(
      "Room not found",
      404,
      "ROOM_NOT_FOUND",
    );
  }

  if (room.status !== "waiting") {
    throw new AppError(
      "This room is no longer accepting new participants",
      403,
      "ROOM_LOCKED",
    );
  }

  const userId = req.user?.id ?? null;

  if (!room.allowAnonymous && !userId) {
    throw new AppError(
      "This room requires an account to join",
      401,
      "ANONYMOUS_JOIN_NOT_ALLOWED",
    );
  }

  if (
    typeof displayName !== "string" ||
    displayName.trim().length === 0
  ) {
    throw new AppError(
      "A display name is required to join",
      400,
      "DISPLAY_NAME_REQUIRED",
    );
  }

  // A signed-in participant re-joining the same room (e.g. page refresh
  // in the lobby, before the contest starts) should resume their existing
  // record rather than create a duplicate. Anonymous participants have no
  // stable identity to dedupe on, so this only applies when logged in.
  if (userId) {
    const existing = await findParticipantByRoomAndUser(room.id, userId);
    if (existing) {
      return res.status(200).json({
        message: "Already joined this room",
        participant: existing,
      });
    }
  }

  const participant = await createParticipant({
    roomId: room.id,
    userId,
    displayName: displayName.trim(),
  });

  return res.status(201).json({
    message: "Joined room successfully",
    participant,
  });
};