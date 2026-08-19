import { useCallback, useState } from "react";
import JoinScreen, { type JoinedParticipant } from "./component/JoinScreen";
import LobbyScreen from "./component/LobbyScreen";
import { useRoomSocket } from "#src/services/socket/useRoomSocket";

type RoomPhase = "join" | "lobby";

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

  useRoomSocket({
    roomId: participant?.roomId,
    auth: participant ? { participantId: participant.id } : null,
    onRoomState: handleRoomState,
    onParticipantJoined: handleParticipantJoined,
    onParticipantDisconnected: handleParticipantDisconnected,
  });

  return (
    <div className="min-h-screen bg-canvas font-sans text-ink">
      {phase === "join" && <JoinScreen onNext={handleJoined} />}

      {phase === "lobby" && participant && (
        <LobbyScreen name={participant.displayName} playerCount={playerCount} />
      )}
    </div>
  );
};

export default ParticipantRoomPage;