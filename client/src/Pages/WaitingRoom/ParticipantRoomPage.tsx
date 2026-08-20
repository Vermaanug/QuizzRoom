import { useCallback, useState } from "react";
import JoinScreen, { type JoinedParticipant } from "./component/JoinScreen";
import LobbyScreen from "./component/LobbyScreen";
import QuestionScreen from "./component/QuestionScreen";
import { useRoomSocket, type LiveQuestion } from "#src/services/socket/useRoomSocket";

type RoomPhase = "join" | "lobby" | "question" | "ended";

interface RoomParticipant {
  id: string;
  displayName: string;
}

const ParticipantRoomPage = () => {
  const [phase, setPhase] = useState<RoomPhase>("join");
  const [participant, setParticipant] = useState<JoinedParticipant | null>(
    null,
  );
  const [playerCount, setPlayerCount] = useState(0);
  const [question, setQuestion] = useState<LiveQuestion | null>(null);
  
  const [score, setScore] = useState(0);

  const handleJoined = (joined: JoinedParticipant) => {
    setParticipant(joined);
    setPlayerCount(1);
    setPhase("lobby");
  };

  const handleRoomState = useCallback((participants: RoomParticipant[]) => {
    setPlayerCount(participants.length);
  }, []);

  const handleParticipantJoined = useCallback(() => {
    setPlayerCount((prev) => prev + 1);
  }, []);

  const handleParticipantDisconnected = useCallback(() => {
    setPlayerCount((prev) => Math.max(1, prev - 1));
  }, []);

  const handleQuestionStarted = useCallback((nextQuestion: LiveQuestion) => {
    setQuestion(nextQuestion);
    setPhase("question");
  }, []);

  const handleContestEnded = useCallback(() => {
    setQuestion(null);
    setPhase("ended");
  }, []);

  useRoomSocket({
    roomId: participant?.roomId,
    auth: participant ? { participantId: participant.id } : null,
    onRoomState: handleRoomState,
    onParticipantJoined: handleParticipantJoined,
    onParticipantDisconnected: handleParticipantDisconnected,
    onQuestionStarted: handleQuestionStarted,
    onContestEnded: handleContestEnded,
  });

  return (
    <div className="min-h-screen bg-canvas font-sans text-ink">
      {phase === "join" && <JoinScreen onNext={handleJoined} />}

      {phase === "lobby" && participant && (
        <LobbyScreen name={participant.displayName} playerCount={playerCount} />
      )}

      {phase === "question" && participant && question && (
        <QuestionScreen
          name={participant.displayName}
          score={score}
          question={question}
        />
      )}

      {phase === "ended" && (
        <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-5 text-center">
          <p className="font-display text-2xl uppercase tracking-[0.08em] text-primary-500">
            Quiz complete
          </p>
          <p className="text-sm text-muted">Thanks for playing!</p>
        </div>
      )}
    </div>
  );
};

export default ParticipantRoomPage;