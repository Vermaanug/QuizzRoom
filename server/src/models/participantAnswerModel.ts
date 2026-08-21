import { randomUUID } from "crypto";
import { prisma } from "../db/prisma.js";

export interface MappedParticipantAnswer {
  id: string;
  participantId: string;
  questionId: string;
  roomId: string;
  selectedOption: string | null;
  isCorrect: boolean;
  timeTakenMs: number;
  answeredAt: Date;
}

const mapAnswer = (answer: any): MappedParticipantAnswer | null => {
  if (!answer) return null;

  return {
    id: answer.id,
    participantId: answer.participantId,
    questionId: answer.questionId,
    roomId: answer.roomId,
    selectedOption: answer.selectedOption,
    isCorrect: answer.isCorrect,
    timeTakenMs: answer.timeTakenMs,
    answeredAt: answer.answeredAt,
  };
};

export const findAnswer = async (
  participantId: string,
  questionId: string,
): Promise<MappedParticipantAnswer | null> => {
  const answer = await prisma.participantAnswer.findUnique({
    where: {
      participantId_questionId: { participantId, questionId },
    },
  });

  return mapAnswer(answer);
};

export const createAnswer = async ({
  participantId,
  questionId,
  roomId,
  selectedOption,
  isCorrect,
  timeTakenMs,
}: {
  participantId: string;
  questionId: string;
  roomId: string;
  selectedOption: string | null;
  isCorrect: boolean;
  timeTakenMs: number;
}): Promise<MappedParticipantAnswer> => {
  const answer = await prisma.participantAnswer.create({
    data: {
      id: randomUUID(),
      participantId,
      questionId,
      roomId,
      selectedOption,
      isCorrect,
      timeTakenMs,
    },
  });

  return mapAnswer(answer)!;
};

export const countAnsweredForQuestion = async (
  roomId: string,
  questionId: string,
): Promise<number> => {
  return prisma.participantAnswer.count({
    where: { roomId, questionId },
  });
};

export interface RoomResultRow {
  participantId: string;
  displayName: string;
  totalScore: number;
  totalTimeMs: number;
  rank: number;
}


const POINTS_PER_CORRECT_ANSWER = 100;

export const computeRoomResults = async (
  roomId: string,
): Promise<RoomResultRow[]> => {
  const participants = await prisma.participant.findMany({
    where: { roomId },
    select: { id: true, displayName: true },
  });

  const answers = await prisma.participantAnswer.findMany({
    where: { roomId },
    select: { participantId: true, isCorrect: true, timeTakenMs: true },
  });

  interface Accumulator {
    displayName: string;
    totalScore: number;
    totalTimeMs: number;
  }

  const byParticipant = new Map<string, Accumulator>(
    participants.map((p: { id: string; displayName: string }) => [
      p.id,
      { displayName: p.displayName, totalScore: 0, totalTimeMs: 0 },
    ]),
  );

  for (const answer of answers as {
    participantId: string;
    isCorrect: boolean;
    timeTakenMs: number;
  }[]) {
    const entry = byParticipant.get(answer.participantId);
    if (!entry) continue;
    if (answer.isCorrect) entry.totalScore += POINTS_PER_CORRECT_ANSWER;
    entry.totalTimeMs += answer.timeTakenMs;
  }

  const rows = Array.from(byParticipant.entries()).map(
    ([participantId, entry]) => ({
      participantId,
      displayName: entry.displayName,
      totalScore: entry.totalScore,
      totalTimeMs: entry.totalTimeMs,
    }),
  );

  rows.sort((a, b) =>
    a.totalScore !== b.totalScore
      ? b.totalScore - a.totalScore
      : a.totalTimeMs - b.totalTimeMs,
  );

  return rows.map((row, i) => ({ ...row, rank: i + 1 }));
};