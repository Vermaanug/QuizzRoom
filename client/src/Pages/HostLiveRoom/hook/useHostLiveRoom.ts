import { useCallback, useEffect, useState } from "react";
import useGlobalRoutesHandler from "#src/services/common/useGlobalRouteHandler";
import useGetRoomService from "#src/services/room/useGetRoomService";
import {
  useRoomSocket,
  type LiveQuestion,
  type RoomResultRow,
} from "#src/services/socket/useRoomSocket";

interface Player {
  id: string;
  name: string;
}

const useHostLiveRoom = () => {
  const { activeRoutes } = useGlobalRoutesHandler();
  const roomToken = activeRoutes[activeRoutes.length - 2];

  const {
    service: { getCurrentRoomService },
  } = useGetRoomService({ inviteToken: roomToken ?? "" });

  const room = getCurrentRoomService.data?.room;

  const [players, setPlayers] = useState<Player[]>([]);
  const [question, setQuestion] = useState<LiveQuestion | null>(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [contestEnded, setContestEnded] = useState(false);
  const [results, setResults] = useState<RoomResultRow[]>([]);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const handleRoomState = useCallback(
    (participants: { id: string; displayName: string }[]) => {
      setPlayers(participants.map((p) => ({ id: p.id, name: p.displayName })));
    },
    [],
  );

  const handleParticipantDisconnected = useCallback((participantId: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== participantId));
  }, []);

  const handleQuestionStarted = useCallback((nextQuestion: LiveQuestion) => {
    setQuestion(nextQuestion);
    setAnsweredCount(0);
  }, []);

  const handleAnswerProgress = useCallback(
    (data: { answeredCount: number }) => {
      setAnsweredCount(data.answeredCount);
    },
    [],
  );

  const handleContestEnded = useCallback((data: { results: RoomResultRow[] }) => {
    setResults(data.results);
    setContestEnded(true);
    setQuestion(null);
  }, []);

  const { nextQuestion: emitNextQuestion } = useRoomSocket({
    roomId: room?.id,
    auth: room?.id ? {} : null,
    onRoomState: handleRoomState,
    onParticipantDisconnected: handleParticipantDisconnected,
    onQuestionStarted: handleQuestionStarted,
    onAnswerProgress: handleAnswerProgress,
    onContestEnded: handleContestEnded,
  });

  useEffect(() => {
    if (!question) {
      setRemainingSeconds(0);
      return;
    }

    const tick = () => {
      const remaining = Math.max(
        0,
        Math.round((new Date(question.endsAt).getTime() - Date.now()) / 1000),
      );
      setRemainingSeconds(remaining);
    };

    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [question]);

  return {
    services: { getCurrentRoomService },
    states: {
      roomToken,
      players,
      question,
      remainingSeconds,
      answeredCount,
      contestEnded,
      results,
    },
    functions: { nextQuestion: emitNextQuestion },
  };
};

export default useHostLiveRoom;