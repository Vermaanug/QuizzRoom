import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { findUserById } from "../models/userModel.js";
import { findRoomById } from "../models/roomModel.js";
import {
  findParticipantById,
  findParticipantsByRoomId,
  markParticipantDisconnected,
} from "../models/participantModel.js";

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

    // Host path — same cookie the REST authMiddleware checks.
    const token = (socket.request as unknown as { cookies?: Record<string, string> })
      .cookies?.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as DecodedToken;
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

  io.on("connection", (socket: Socket) => {
    // roomId here is the DB Room.id (not the invite token). The host
    // gets this from GET /room/:token (already returns room.id); the
    // participant gets it from the join response (participant.roomId).
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

        // Hydrates the host's roster with anyone who joined before the
        // host's socket connected (e.g. host refreshed mid-lobby).
        const participants = await findParticipantsByRoomId(roomId);
        socket.emit("room_state", { participants });
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

        // Tell everyone else already in the channel (host + other
        // players) that this participant just joined.
        socket.to(roomId).emit("participant_joined", { participant });
      }
    });

    socket.on("disconnect", async () => {
      const data = socket.data as SocketData;

      if (data.role === "participant" && data.participantId) {
        // PRD §6 — no rejoin after disconnect, score locks. Persisted so
        // this survives a server restart, not just tracked in memory.
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