import { useState } from "react";
import JoinScreen from "./component/JoinScreen";
import LobbyScreen from "./component/LobbyScreen";
import QuestionScreen from "./component/QuestionScreen";

type RoomPhase = "join" | "lobby" | "question";

const ParticipantRoomPage = () => {
  const [phase, setPhase] = useState<RoomPhase>("join");

  const playerCount = 2

  return (
    <div className="min-h-screen bg-canvas font-sans text-ink">
      {phase === "join" && (
        <JoinScreen onNext={() => setPhase("lobby")} />
      )}

      {phase === "lobby" && (
        <LobbyScreen
         
        />
      )}

      {phase === "question" && (
        <QuestionScreen
          name={name}
          score={0}
          onNext={() => {}}
        />
      )}

      {phase === "lobby" && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 px-5">
          <button
            type="button"
            onClick={() => setPhase("question")}
            className="border px-4 py-2 font-display text-xs uppercase tracking-[0.1em] text-muted transition hover:border-muted hover:text-ink focus:outline-none focus:ring-2 focus:ring-primary-700"
          >
            (demo) simulate host start
          </button>
        </div>
      )}
    </div>
  );
};

export default ParticipantRoomPage;