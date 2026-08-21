import { MappedQuestion } from "../types/index.js";

// In-memory only, on purpose: contest progress (current question, timer
// deadline, live answer count) is ephemeral live state. ParticipantAnswer
// rows are the permanent record — this is just what's needed to run the
// live session and compute timeTakenMs.
// NOTE: single-process only. Move to Redis if this ever runs scaled out.

interface RoomContestState {
  questions: MappedQuestion[];
  currentIndex: number;
  currentQuestionStartedAt: number; // epoch ms
  answeredParticipantIds: Set<string>;
  advanceTimer: NodeJS.Timeout | null;
  isAdvancing: boolean;
}

const roomContests = new Map<string, RoomContestState>();

export const startRoomContest = (roomId: string, questions: MappedQuestion[]) => {
  roomContests.set(roomId, {
    questions,
    currentIndex: 0,
    currentQuestionStartedAt: Date.now(),
    answeredParticipantIds: new Set(),
    advanceTimer: null,
    isAdvancing: false,
  });
};

export const getRoomContest = (roomId: string) => roomContests.get(roomId);

export const getCurrentQuestion = (roomId: string) => {
  const contest = roomContests.get(roomId);
  if (!contest || contest.currentIndex >= contest.questions.length) return undefined;
  return contest.questions[contest.currentIndex];
};

export const setAdvanceTimer = (roomId: string, timer: NodeJS.Timeout) => {
  const contest = roomContests.get(roomId);
  if (contest) contest.advanceTimer = timer;
};

export const clearAdvanceTimer = (roomId: string) => {
  const contest = roomContests.get(roomId);
  if (contest?.advanceTimer) {
    clearTimeout(contest.advanceTimer);
    contest.advanceTimer = null;
  }
};

export const tryBeginAdvance = (roomId: string): boolean => {
  const contest = roomContests.get(roomId);
  if (!contest || contest.isAdvancing) return false;
  contest.isAdvancing = true;
  return true;
};

export const advanceRoomContest = (roomId: string) => {
  const contest = roomContests.get(roomId);
  if (!contest) return undefined;
  contest.currentIndex += 1;
  contest.currentQuestionStartedAt = Date.now();
  contest.answeredParticipantIds = new Set();
  contest.advanceTimer = null;
  contest.isAdvancing = false;
  return contest;
};

export const recordAnswered = (roomId: string, participantId: string) => {
  const contest = roomContests.get(roomId);
  contest?.answeredParticipantIds.add(participantId);
};

export const hasAnswered = (roomId: string, participantId: string) => {
  const contest = roomContests.get(roomId);
  return contest?.answeredParticipantIds.has(participantId) ?? false;
};

export const endRoomContest = (roomId: string) => {
  clearAdvanceTimer(roomId);
  roomContests.delete(roomId);
};


export const toLiveQuestionPayload = (
  question: MappedQuestion,
  index: number,
  total: number,
) => ({
  id: question.id,
  text: question.text,
  codeSnippet: question.codeSnippet,
  optionA: question.optionA,
  optionB: question.optionB,
  optionC: question.optionC,
  optionD: question.optionD,
  timeLimitSeconds: question.timeLimitSeconds,
  index: index + 1,
  total,
  endsAt: new Date(Date.now() + question.timeLimitSeconds * 1000).toISOString(),
});