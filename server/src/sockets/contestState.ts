import { MappedQuestion } from "../types/index.js";


interface RoomContestState {
  questions: MappedQuestion[];
  currentIndex: number;
}

const roomContests = new Map<string, RoomContestState>();

export const startRoomContest = (roomId: string, questions: MappedQuestion[]) => {
  roomContests.set(roomId, { questions, currentIndex: 0 });
};

export const getRoomContest = (roomId: string) => roomContests.get(roomId);

export const advanceRoomContest = (roomId: string) => {
  const contest = roomContests.get(roomId);
  if (!contest) return undefined;
  contest.currentIndex += 1;
  return contest;
};

export const endRoomContest = (roomId: string) => {
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