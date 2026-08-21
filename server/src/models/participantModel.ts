import { randomUUID } from "crypto";
import { prisma } from "../db/prisma.js";
import { MappedParticipant } from "../types/index.js";

const mapParticipant = (participant: any): MappedParticipant | null => {
  if (!participant) return null;

  return {
    id: participant.id,
    roomId: participant.roomId,
    userId: participant.userId,
    displayName: participant.displayName,
    connectionStatus: participant.connectionStatus,
    joinedAt: participant.joinedAt,
    disconnectedAt: participant.disconnectedAt,
  };
};

export const createParticipant = async ({
  roomId,
  userId = null,
  displayName,
}: {
  roomId: string;
  userId?: string | null;
  displayName: string;
}): Promise<MappedParticipant> => {
  const participant = await prisma.participant.create({
    data: {
      id: randomUUID(),
      roomId,
      userId,
      displayName,
    },
  });

  return mapParticipant(participant)!;
};

export const findParticipantById = async (
  id: string,
): Promise<MappedParticipant | null> => {
  const participant = await prisma.participant.findUnique({
    where: {
      id,
    },
  });

  return mapParticipant(participant);
};

export const findParticipantByRoomAndUser = async (
  roomId: string,
  userId: string,
): Promise<MappedParticipant | null> => {
  const participant = await prisma.participant.findFirst({
    where: {
      roomId,
      userId,
    },
  });

  return mapParticipant(participant);
};

export const findParticipantsByRoomId = async (
  roomId: string,
): Promise<MappedParticipant[]> => {
  const participants = await prisma.participant.findMany({
    where: {
      roomId,
    },
    orderBy: {
      joinedAt: "asc",
    },
  });

  return participants.map((participant) => mapParticipant(participant)!);
};

export const findParticipantsByRoomIdAndStatus = async (
  roomId: string,
  connectionStatus: "connected" | "disconnected",
): Promise<MappedParticipant[]> => {
  const participants = await prisma.participant.findMany({
    where: {
      roomId,
      connectionStatus,
    },
    orderBy: {
      joinedAt: "asc",
    },
  });

  return participants.map((participant) => mapParticipant(participant)!);
};

export const countParticipantsByRoomId = async (
  roomId: string,
): Promise<number> => {
  return prisma.participant.count({
    where: {
      roomId,
    },
  });
};

// Called on socket disconnect (PRD §6 — no rejoin, score locks at
// whatever it was). Persisted rather than tracked only in-memory so a
// server restart or horizontal scaling doesn't lose disconnect state.
export const markParticipantDisconnected = async (
  id: string,
): Promise<MappedParticipant> => {
  const participant = await prisma.participant.update({
    where: {
      id,
    },
    data: {
      connectionStatus: "disconnected",
      disconnectedAt: new Date(),
    },
  });

  return mapParticipant(participant)!;
};
