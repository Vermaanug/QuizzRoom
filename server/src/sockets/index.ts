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
  findParticipantsByRoomIdAndStatus,
  markParticipantDisconnected,
} from "../models/participantModel.js";
import {
  findAnswer,
  createAnswer,
  countAnsweredForQuestion,
  computeRoomResults,
} from "../models/participantAnswerModel.js";
import {
  startRoomContest,
  getRoomContest,
  getCurrentQuestion,
  advanceRoomContest,
  endRoomContest,
  recordAnswered,
  hasAnswered,
  setAdvanceTimer,
  clearAdvanceTimer,
  tryBeginAdvance,
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
    if (!user) return next(new Error("User not found"));

    (socket.data as SocketData).role = "host";
    (socket.data as SocketData).userId = user.id;
    return next();
  });

  // Emits question_started for the room's current question, or ends the
  // contest with the final leaderboard if there are no more questions.
  // Also (re)schedules the automatic timeout-advance for whichever
  // question was just pushed.
  const pushCurrentQuestion = async (roomId: string) => {
    const contest = getRoomContest(roomId);

    if (!contest || contest.currentIndex >= contest.questions.length) {
      endRoomContest(roomId);
      await updateRoomStatus(roomId, "completed");
      const results = await computeRoomResults(roomId);
      io.to(roomId).emit("contest_ended", { results });
      return;
    }

    const question = contest.questions[contest.currentIndex];
    io.to(roomId).emit(
      "question_started",
      toLiveQuestionPayload(question, contest.currentIndex, contest.questions.length),
    );

    const total = (await findParticipantsByRoomId(roomId)).length;
    io.to(roomId).emit("answer_progress", { answeredCount: 0, totalParticipants: total });

    const timer = setTimeout(() => {
      void advanceToNextQuestion(roomId);
    }, question.timeLimitSeconds * 1000);
    setAdvanceTimer(roomId, timer);
  };

  // Single shared path for ending the current question and moving on —
  // used by the auto-timeout, the all-answered shortcut, and the host's
  // manual override alike, so exactly one of them ever actually runs
  // the transition (tryBeginAdvance is the lock that guarantees this).
  const advanceToNextQuestion = async (roomId: string) => {
    if (!tryBeginAdvance(roomId)) return;

    clearAdvanceTimer(roomId);

    const currentQuestion = getCurrentQuestion(roomId);
    if (currentQuestion) {
      io.to(roomId).emit("question_ended", {
        questionId: currentQuestion.id,
        correctOption: currentQuestion.correctOption,
      });
    }

    advanceRoomContest(roomId);
    await pushCurrentQuestion(roomId);
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

        const participants = await findParticipantsByRoomIdAndStatus(roomId, "connected");
        socket.emit("room_state", { participants });

        socket.to(roomId).emit("participant_joined", { participants });

        const contest = getRoomContest(roomId);
        if (contest && contest.currentIndex < contest.questions.length) {
          const question = contest.questions[contest.currentIndex];
          socket.emit(
            "question_started",
            toLiveQuestionPayload(question, contest.currentIndex, contest.questions.length),
          );
          socket.emit("answer_progress", {
            answeredCount: contest.answeredParticipantIds.size,
            totalParticipants: participants.length,
          });
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

        const contest = getRoomContest(roomId);
        if (contest && contest.currentIndex < contest.questions.length) {
          const question = contest.questions[contest.currentIndex];
          socket.emit(
            "question_started",
            toLiveQuestionPayload(question, contest.currentIndex, contest.questions.length),
          );
        }
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
        socket.emit("error", { message: "This quiz has no questions to host" });
        return;
      }

      await updateRoomStatus(data.roomId, "in_progress");
      startRoomContest(data.roomId, questions);

      io.to(data.roomId).emit("contest_started", { roomId: data.roomId });
      await pushCurrentQuestion(data.roomId);
    });

    // Participant submits an answer for the room's CURRENT question
    // (never a specific questionId from the client — trusting the
    // client's questionId would let a stale/malicious client answer a
    // past question after the fact).
    socket.on("submit_answer", async ({ selectedOption }: { selectedOption: string | null }) => {
      const data = socket.data as SocketData;

      if (data.role !== "participant" || !data.participantId || !data.roomId) {
        socket.emit("error", { message: "Not authorized" });
        return;
      }

      const contest = getRoomContest(data.roomId);
      const question = getCurrentQuestion(data.roomId);

      if (!contest || !question) {
        socket.emit("error", { message: "No question is currently active" });
        return;
      }

      if (hasAnswered(data.roomId, data.participantId)) {
        socket.emit("error", { message: "You already answered this question" });
        return;
      }

      const now = Date.now();
      const deadline = contest.currentQuestionStartedAt + question.timeLimitSeconds * 1000;
      if (now > deadline) {
        socket.emit("error", { message: "Time is up for this question" });
        return;
      }

      const existing = await findAnswer(data.participantId, question.id);
      if (existing) {
        socket.emit("error", { message: "You already answered this question" });
        return;
      }

      const isCorrect = selectedOption === question.correctOption;
      const timeTakenMs = now - contest.currentQuestionStartedAt;

      await createAnswer({
        participantId: data.participantId,
        questionId: question.id,
        roomId: data.roomId,
        selectedOption,
        isCorrect,
        timeTakenMs,
      });

      recordAnswered(data.roomId, data.participantId);

      // Private ack to the submitter only — immediate feedback, not
      // broadcast (so other participants can't infer it).
      socket.emit("answer_result", { isCorrect, timeTakenMs });

      const answeredCount = await countAnsweredForQuestion(data.roomId, question.id);
      const totalParticipants = (await findParticipantsByRoomId(data.roomId)).length;
      io.to(data.roomId).emit("answer_progress", { answeredCount, totalParticipants });

      // Everyone's answered — no reason to keep waiting for the timer.
      if (answeredCount >= totalParticipants) {
        await advanceToNextQuestion(data.roomId);
      }
    });

    // Manual override — lets the host skip a stuck/slow question early.
    // No longer the primary pacing mechanism (that's automatic now via
    // the timeout in pushCurrentQuestion, and the all-answered shortcut
    // in submit_answer above); this just goes through the same guarded
    // advanceToNextQuestion so it can't race with either of those.
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

      await advanceToNextQuestion(data.roomId);
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