import { useCallback, useEffect, useState } from "react";
import useGlobalRoutesHandler from "#src/services/common/useGlobalRouteHandler";
import useGetRoomService from "#src/services/room/useGetRoomService";
import { useRoomSocket, type LiveQuestion } from "#src/services/socket/useRoomSocket";

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
  const [contestEnded, setContestEnded] = useState(false);
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
  }, []);

  const handleContestEnded = useCallback(() => {
    setContestEnded(true);
    setQuestion(null);
  }, []);

  const { nextQuestion: emitNextQuestion } = useRoomSocket({
    roomId: room?.id,
    auth: room?.id ? {} : null,
    onRoomState: handleRoomState,
    onParticipantDisconnected: handleParticipantDisconnected,
    onQuestionStarted: handleQuestionStarted,
    onContestEnded: handleContestEnded,
  });

  // Server sends an absolute endsAt timestamp, not a ticking countdown —
  // recompute remaining seconds locally every second so a late-joining
  // or lagging client still lands on the same wall-clock deadline.
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
      contestEnded,
    },
    functions: {
      nextQuestion: emitNextQuestion,
    },
  };
};

export default useHostLiveRoom;