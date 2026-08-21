import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

interface RoomParticipant {
  id: string;
  displayName: string;
}

export interface LiveQuestion {
  id: string;
  text: string;
  codeSnippet: string | null;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  timeLimitSeconds: number;
  index: number;
  total: number;
  endsAt: string;
}

export interface RoomResultRow {
  participantId: string;
  displayName: string;
  totalScore: number;
  totalTimeMs: number;
  rank: number;
}

type SocketAuth = Record<string, never> | { participantId: string };

interface UseRoomSocketOptions {
  roomId?: string;
  auth: SocketAuth | null;
  onParticipantJoined?: (participant: RoomParticipant) => void;
  onParticipantDisconnected?: (participantId: string) => void;
  onRoomState?: (participants: RoomParticipant[]) => void;
  onContestStarted?: (data: { roomId: string }) => void;
  onQuestionStarted?: (question: LiveQuestion) => void;
  onQuestionEnded?: (data: { questionId: string; correctOption: string }) => void;
  onAnswerResult?: (data: { isCorrect: boolean; timeTakenMs: number }) => void;
  onAnswerProgress?: (data: { answeredCount: number; totalParticipants: number }) => void;
  onContestEnded?: (data: { results: RoomResultRow[] }) => void;
}

export const useRoomSocket = ({
  roomId,
  auth,
  onParticipantJoined,
  onParticipantDisconnected,
  onRoomState,
  onContestStarted,
  onQuestionStarted,
  onQuestionEnded,
  onAnswerResult,
  onAnswerProgress,
  onContestEnded,
}: UseRoomSocketOptions) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!roomId || !auth) return;

    const socket = io(SOCKET_URL, { auth, withCredentials: true });
    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("join_room", { roomId });
    });

    socket.on("disconnect", () => setIsConnected(false));

    socket.on("participant_joined", ({ participant }: { participant: RoomParticipant }) => {
      onParticipantJoined?.(participant);
    });

    socket.on("participant_disconnected", ({ participantId }: { participantId: string }) => {
      onParticipantDisconnected?.(participantId);
    });

    socket.on("room_state", ({ participants }: { participants: RoomParticipant[] }) => {
      onRoomState?.(participants);
    });

    socket.on("contest_started", (data: { roomId: string }) => {
      onContestStarted?.(data);
    });

    socket.on("question_started", (question: LiveQuestion) => {
      onQuestionStarted?.(question);
    });

    socket.on("question_ended", (data: { questionId: string; correctOption: string }) => {
      onQuestionEnded?.(data);
    });

    socket.on("answer_result", (data: { isCorrect: boolean; timeTakenMs: number }) => {
      onAnswerResult?.(data);
    });

    socket.on(
      "answer_progress",
      (data: { answeredCount: number; totalParticipants: number }) => {
        onAnswerProgress?.(data);
      },
    );

    socket.on("contest_ended", (data: { results: RoomResultRow[] }) => {
      onContestEnded?.(data);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, JSON.stringify(auth)]);

  const startContest = () => socketRef.current?.emit("start_contest");
  const nextQuestion = () => socketRef.current?.emit("next_question");
  const submitAnswer = (selectedOption: string | null) =>
    socketRef.current?.emit("submit_answer", { selectedOption });

  return { isConnected, startContest, nextQuestion, submitAnswer };
};