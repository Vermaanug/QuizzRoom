import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import JoinScreen, { type JoinedParticipant } from "./component/JoinScreen";
import LobbyScreen from "./component/LobbyScreen";
import QuestionScreen from "./component/QuestionScreen";
import BrandMark from "#src/component/Brand/BrandMark";
import {
  useRoomSocket,
  type LiveQuestion,
  type RoomResultRow,
} from "#src/services/socket/useRoomSocket";

type RoomPhase = "join" | "lobby" | "question" | "ended";

interface RoomParticipant {
  id: string;
  displayName: string;
}

const ParticipantRoomPage = () => {
  const [phase, setPhase] = useState<RoomPhase>("join");
  const [participant, setParticipant] = useState<JoinedParticipant | null>(null);
  const [playerCount, setPlayerCount] = useState(0);
  const [question, setQuestion] = useState<LiveQuestion | null>(null);
  const [correctOption, setCorrectOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<RoomResultRow[]>([]);

  const handleJoined = (joined: JoinedParticipant) => {
    setParticipant(joined);
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
    setCorrectOption(null);
    setPhase("question");
  }, []);

  const handleQuestionEnded = useCallback(
    (data: { questionId: string; correctOption: string }) => {
      setCorrectOption(data.correctOption);
    },
    [],
  );

  const handleAnswerResult = useCallback((data: { isCorrect: boolean }) => {
    if (data.isCorrect) setScore((prev) => prev + 100);
  }, []);

  const handleContestEnded = useCallback((data: { results: RoomResultRow[] }) => {
    setResults(data.results);
    setQuestion(null);
    setPhase("ended");
  }, []);

  const { submitAnswer } = useRoomSocket({
    roomId: participant?.roomId,
    auth: participant ? { participantId: participant.id } : null,
    onRoomState: handleRoomState,
    onParticipantJoined: handleParticipantJoined,
    onParticipantDisconnected: handleParticipantDisconnected,
    onQuestionStarted: handleQuestionStarted,
    onQuestionEnded: handleQuestionEnded,
    onAnswerResult: handleAnswerResult,
    onContestEnded: handleContestEnded,
  });

  const myResult = results.find((r) => r.participantId === participant?.id);

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
          correctOption={correctOption}
          onSelect={submitAnswer}
        />
      )}

      {phase === "ended" && (
        <div className="mx-auto flex min-h-screen w-full max-w-[540px] flex-col items-center px-5 py-16 sm:px-10">
          

          {myResult && (
            <>
              <p className="mt-16 font-display text-6xl text-primary-500 sm:text-7xl">
                #{myResult.rank}
              </p>
              <p className="mt-2 text-sm text-muted">Your rank</p>

              <p className="mt-10 font-display text-4xl text-ink">
                {myResult.totalScore.toLocaleString()}
              </p>
              <p className="mt-2 text-sm text-muted">points</p>
            </>
          )}

          <section
            aria-labelledby="leaderboard-heading"
            className="w-full"
          >
            <h2
              id="leaderboard-heading"
              className="font-display text-xs uppercase tracking-[0.12em] text-muted"
            >
              Leaderboard
            </h2>

            <ul className="mt-4 flex flex-col gap-3">
              {results.map((row) => {
                const isMe = row.participantId === participant?.id;
                const medal =
                  row.rank === 1 ? "🥇" : row.rank === 2 ? "🥈" : row.rank === 3 ? "🥉" : null;

                return (
                  <li
                    key={row.participantId}
                    className={`flex h-14 items-center justify-between border px-5 ${
                      isMe ? "border-primary-500 bg-primary-500/10" : "bg-surface"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      {medal ? (
                        <span aria-hidden="true" className="text-lg">
                          {medal}
                        </span>
                      ) : (
                        <span className="w-5 text-center font-mono text-sm text-muted">
                          {row.rank}
                        </span>
                      )}
                      <span className="text-base text-ink">
                        {isMe ? (
                          <>
                            <span className="font-semibold text-primary-500">
                              {row.displayName}
                            </span>{" "}
                            <span className="text-muted">(you)</span>
                          </>
                        ) : (
                          row.displayName
                        )}
                      </span>
                    </span>
                    <span className="font-mono text-base font-semibold text-ink">
                      {row.totalScore.toLocaleString()}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>

          <Link
            to="/"
            className="mt-10 inline-flex h-14 w-full items-center justify-center gap-2 border font-display text-sm uppercase tracking-[0.1em] text-ink transition hover:border-muted focus:outline-none focus:ring-2 focus:ring-primary-700"
          >
            <span aria-hidden="true">&larr;</span>
            Back to home
          </Link>
        </div>
      )}
    </div>
  );
};

export default ParticipantRoomPage;