import { randomBytes, randomUUID } from "crypto";
import { prisma } from "../db/prisma.js";
import { MappedRoom } from "../types/index.js";

const mapRoom = (room: any): MappedRoom | null => {
  if (!room) return null;

  return {
    id: room.id,
    quizId: room.quizId,
    hostUserId: room.hostUserId,
    inviteToken: room.inviteToken,
    allowAnonymous: room.allowAnonymous,
    status: room.status,
    startedAt: room.startedAt,
    endedAt: room.endedAt,
  };
};

export const findRoomById = async (id: string): Promise<MappedRoom | null> => {
  const room = await prisma.room.findUnique({
    where: {
      id,
    },
  });

  return mapRoom(room);
};

export const findRoomByInviteToken = async (
  inviteToken: string,
): Promise<MappedRoom | null> => {
  const room = await prisma.room.findUnique({
    where: {
      inviteToken,
    },
  });

  return mapRoom(room);
};

export const findRoomByInviteTokenAndStatus = async (
  inviteToken: string,
  status: "waiting" | "in_progress" | "completed",
): Promise<MappedRoom | null> => {
  const room = await prisma.room.findUnique({
    where: {
      inviteToken,
      status
    },
  });

  return mapRoom(room);
};

export const findRoomsByQuizId = async (
  quizId: string,
): Promise<MappedRoom[]> => {
  const rooms = await prisma.room.findMany({
    where: {
      quizId,
    },
  });

  return rooms.map((room) => mapRoom(room)!);
};

export const findRoomsByHostUserId = async (
  hostUserId: string,
): Promise<MappedRoom[]> => {
  const rooms = await prisma.room.findMany({
    where: {
      hostUserId,
    },
  });

  return rooms.map((room) => mapRoom(room)!);
};

export const createRoom = async ({
  quizId,
  hostUserId,
  allowAnonymous = true,
}: {
  quizId: string;
  hostUserId: string;
  allowAnonymous?: boolean;
}): Promise<MappedRoom> => {
  const room = await prisma.room.create({
    data: {
      id: randomUUID(),
      quizId,
      hostUserId,
      inviteToken: randomBytes(8).toString("base64url"),
      allowAnonymous,
    },
  });

  return mapRoom(room)!;
};

export const updateRoomStatus = async (
  id: string,
  status: "waiting" | "in_progress" | "completed",
): Promise<MappedRoom> => {
  const room = await prisma.room.update({
    where: {
      id,
    },
    data: {
      status,
      ...(status === "in_progress" && {
        startedAt: new Date(),
      }),
      ...(status === "completed" && {
        endedAt: new Date(),
      }),
    },
  });

  return mapRoom(room)!;
};

export const deleteRoom = async (id: string): Promise<MappedRoom> => {
  const room = await prisma.room.delete({
    where: {
      id,
    },
  });

  return mapRoom(room)!;
};
