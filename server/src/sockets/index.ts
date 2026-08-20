import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { findUserById } from "../models/userModel.js";
import { findRoomById, updateRoomStatus } from "../models/roomModel.js";
import { findQuestionsByQuizAndOwner } from "../models/questionModel.js";
import {
  findParticipantById,
  findParticipantsByRoomId,
  markParticipantDisconnected,
} from "../models/participantModel.js";
import {
  startRoomContest,
  getRoomContest,
  advanceRoomContest,
  endRoomContest,
  toLiveQuestionPayload,
} from "./contestState.js";

interface DecodedToken {
  id: string;
}

interface SocketData {
  role: "host" | "participant";
  userId?: string;
  participantId?: string;
  roomId?: string;
}

// Auth here mirrors authMiddleware.ts exactly (cookie -> jwt.verify ->
// findUserById), reusing cookie-parser via io.engine.use() instead of a
// second cookie-parsing dependency, so REST and sockets stay in sync.
export const initSocketServer = (httpServer: HttpServer) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  io.engine.use(cookieParser());

  io.use(async (socket, next) => {
    const { participantId } = socket.handshake.auth as {
      participantId?: string;
    };

    if (participantId) {
      (socket.data as SocketData).role = "participant";
      (socket.data as SocketData).participantId = participantId;
      return next();
    }

    const token = (
      socket.request as unknown as { cookies?: Record<string, string> }
    ).cookies?.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY as string,
      ) as DecodedToken;
    } catch {
      return next(new Error("Invalid or expired token"));
    }

    const user = await findUserById(decoded.id);

    if (!user) {
      return next(new Error("User not found"));
    }

    (socket.data as SocketData).role = "host";
    (socket.data as SocketData).userId = user.id;
    return next();
  });

  // Shared by start_contest (first question) and next_question
  // (every question after). Emits question_started, or contest_ended
  // + marks the room completed once the question list is exhausted.
  const pushCurrentQuestion = async (roomId: string) => {
    const contest = getRoomContest(roomId);

    if (!contest || contest.currentIndex >= contest.questions.length) {
      endRoomContest(roomId);
      await updateRoomStatus(roomId, "completed");
      io.to(roomId).emit("contest_ended");
      return;
    }

    const question = contest.questions[contest.currentIndex];
    io.to(roomId).emit(
      "question_started",
      toLiveQuestionPayload(question, contest.currentIndex, contest.questions.length),
    );
  };

  io.on("connection", (socket: Socket) => {
    socket.on("join_room", async ({ roomId }: { roomId: string }) => {
      const data = socket.data as SocketData;
      const room = await findRoomById(roomId);

      if (!room) {
        socket.emit("error", { message: "Room not found" });
        return;
      }

      if (data.role === "host") {
        if (room.hostUserId !== data.userId) {
          socket.emit("error", { message: "Not authorized for this room" });
          return;
        }

        data.roomId = roomId;
        socket.join(roomId);

        const participants = await findParticipantsByRoomId(roomId);
        socket.emit("room_state", { participants });

        // Host reconnecting mid-contest (e.g. page refresh on the live
        // page) — resend the current question so they don't lose state.
        const contest = getRoomContest(roomId);
        if (contest && contest.currentIndex < contest.questions.length) {
          const question = contest.questions[contest.currentIndex];
          socket.emit(
            "question_started",
            toLiveQuestionPayload(question, contest.currentIndex, contest.questions.length),
          );
        }
        return;
      }

      if (data.role === "participant") {
        const participant = await findParticipantById(data.participantId!);

        if (!participant || participant.roomId !== roomId) {
          socket.emit("error", { message: "Not authorized for this room" });
          return;
        }

        data.roomId = roomId;
        socket.join(roomId);

        socket.to(roomId).emit("participant_joined", { participant });
      }
    });

    socket.on("start_contest", async () => {
      const data = socket.data as SocketData;

      if (data.role !== "host" || !data.userId || !data.roomId) {
        socket.emit("error", { message: "Not authorized" });
        return;
      }

      const room = await findRoomById(data.roomId);

      if (!room) {
        socket.emit("error", { message: "Room not found" });
        return;
      }

      if (room.hostUserId !== data.userId) {
        socket.emit("error", { message: "Not authorized for this room" });
        return;
      }

      if (room.status === "in_progress") {
        socket.emit("error", { message: "Contest has already started" });
        return;
      }

      const participants = await findParticipantsByRoomId(data.roomId);

      if (participants.length < 2) {
        socket.emit("error", {
          message: "At least 2 players are required to start",
        });
        return;
      }

      const questions = await findQuestionsByQuizAndOwner(room.quizId, data.userId);

      if (questions.length === 0) {
        socket.emit("error", {
          message: "This quiz has no questions to host",
        });
        return;
      }

      await updateRoomStatus(data.roomId, "in_progress");
      startRoomContest(data.roomId, questions);

      io.to(data.roomId).emit("contest_started", { roomId: data.roomId });
      await pushCurrentQuestion(data.roomId);
    });

    // Host-controlled pacing — the "Next question" button, not an
    // automatic timer-driven advance (matches the design: the timer
    // gates participant answering, the host decides when to move on).
    socket.on("next_question", async () => {
      const data = socket.data as SocketData;

      if (data.role !== "host" || !data.userId || !data.roomId) {
        socket.emit("error", { message: "Not authorized" });
        return;
      }

      const room = await findRoomById(data.roomId);

      if (!room || room.hostUserId !== data.userId) {
        socket.emit("error", { message: "Not authorized for this room" });
        return;
      }

      advanceRoomContest(data.roomId);
      await pushCurrentQuestion(data.roomId);
    });

    socket.on("disconnect", async () => {
      const data = socket.data as SocketData;

      if (data.role === "participant" && data.participantId) {
        await markParticipantDisconnected(data.participantId);

        if (data.roomId) {
          socket.to(data.roomId).emit("participant_disconnected", {
            participantId: data.participantId,
          });
        }
      }
    });
  });

  return io;
};