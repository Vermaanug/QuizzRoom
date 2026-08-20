import { X } from "lucide-react";
import { Link } from "react-router-dom";
import BrandMark from "#src/component/Brand/BrandMark";
import useHostLiveRoom from "./hook/useHostLiveRoom";

const OPTION_BADGES: { key: "optionA" | "optionB" | "optionC" | "optionD"; label: string; bg: string; fg: string }[] = [
  { key: "optionA", label: "A", bg: "bg-[#3949ab]", fg: "text-white" },
  { key: "optionB", label: "B", bg: "bg-[#a86b1f]", fg: "text-white" },
  { key: "optionC", label: "C", bg: "bg-success", fg: "text-black" },
  { key: "optionD", label: "D", bg: "bg-danger", fg: "text-white" },
];

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const HostLiveRoomPage = () => {
  const {
    services: { getCurrentRoomService },
    states: { roomToken, players, question, remainingSeconds, contestEnded },
    functions: { nextQuestion },
  } = useHostLiveRoom();

  if (getCurrentRoomService.isLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-canvas"
        role="status"
        aria-live="polite"
      >
        <span className="font-display text-sm uppercase tracking-[0.12em] text-muted">
          Loading room…
        </span>
      </div>
    );
  }

  if (contestEnded) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas px-5 text-center">
        <p className="font-display text-2xl uppercase tracking-[0.08em] text-primary-500">
          Contest complete
        </p>
        <p className="text-sm text-muted">All questions have been asked.</p>
      </div>
    );
  }

  const visiblePlayers = players.slice(0, 6);
  const overflowCount = players.length - visiblePlayers.length;
  const timeFraction = question
    ? Math.min(1, Math.max(0, remainingSeconds / question.timeLimitSeconds))
    : 0;

  return (
    <div className="flex min-h-screen flex-col bg-canvas font-sans text-ink">
      <header className="flex h-16 items-center justify-between border-b px-5 sm:px-10">
        <BrandMark />
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 font-display text-xs uppercase tracking-[0.1em] text-danger">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-danger"
            />
            Live
          </span>
          <span className="border px-3 py-2 font-mono text-xs text-muted">
            #{getCurrentRoomService?.data?.room?.quizTitle}
          </span>
          <Link
            to="/dashboard"
            aria-label="Leave live room"
            className="flex h-9 w-9 items-center justify-center text-muted transition hover:text-ink focus:outline-none focus:ring-2 focus:ring-primary-700"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        <main className="flex-1 border-b px-5 py-10 sm:px-10 md:border-b-0 md:border-r">
          {!question ? (
            <div
              className="flex h-full items-center justify-center"
              role="status"
            >
              <span className="font-display text-sm uppercase tracking-[0.12em] text-muted">
                Waiting for the first question&hellip;
              </span>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b pb-6">
                <p className="font-display text-xs uppercase tracking-[0.12em] text-muted">
                  Question {String(question.index).padStart(2, "0")} /{" "}
                  {String(question.total).padStart(2, "0")}
                </p>
                <span
                  role="timer"
                  aria-label="Time remaining"
                  className="font-display text-4xl tabular-nums text-primary-500"
                >
                  {formatTime(remainingSeconds)}
                </span>
              </div>

              <h1 className="mt-8 text-2xl leading-snug text-ink sm:text-3xl">
                {question.text}
              </h1>

              {question.codeSnippet && (
                <div className="mt-6 border bg-surface">
                  <div className="flex items-center gap-2 border-b px-4 py-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-danger" aria-hidden="true" />
                    <span className="h-2.5 w-2.5 rounded-full bg-primary-500" aria-hidden="true" />
                    <span className="h-2.5 w-2.5 rounded-full bg-success" aria-hidden="true" />
                    <span className="ml-2 font-mono text-xs text-muted">javascript</span>
                  </div>
                  <pre className="overflow-x-auto p-4 font-mono text-sm text-ink">
                    <code>{question.codeSnippet}</code>
                  </pre>
                </div>
              )}

              <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {OPTION_BADGES.map((option) => (
                  <div
                    key={option.key}
                    className="flex items-center gap-4 border bg-surface px-5 py-5"
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center font-display text-sm ${option.bg} ${option.fg}`}
                      aria-hidden="true"
                    >
                      {option.label}
                    </span>
                    <span className="text-base text-ink">{question[option.key]}</span>
                  </div>
                ))}
              </div>

              <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted">
                  {players.length} of {players.length} players are answering
                </p>
                <button
                  type="button"
                  onClick={nextQuestion}
                  className="inline-flex h-12 items-center justify-center gap-2 self-start bg-primary-500 px-6 font-display text-sm uppercase tracking-[0.1em] text-black shadow-button transition hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-700 sm:self-auto"
                >
                  Next question
                  <span aria-hidden="true">&gt;</span>
                </button>
              </div>
            </>
          )}
        </main>

        <aside className="w-full border-t px-5 py-8 sm:px-10 md:w-[320px] md:border-t-0">
          <p className="font-display text-xs uppercase tracking-[0.12em] text-ink">
            Players
          </p>
          <p className="mt-1 text-sm text-muted">{players.length} joined</p>

          <ul className="mt-6 flex flex-col gap-4">
            {visiblePlayers.map((player, i) => (
              <li key={player.id} className="flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <span className="font-mono text-xs text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-base text-ink">{player.name}</span>
                </span>
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-primary-500"
                />
              </li>
            ))}
          </ul>

          {overflowCount > 0 && (
            <p className="mt-4 text-sm text-muted">+ {overflowCount} more</p>
          )}
        </aside>
      </div>

      {question && (
        <div
          className="h-1 w-full bg-line"
          role="progressbar"
          aria-label="Time remaining for this question"
          aria-valuenow={remainingSeconds}
          aria-valuemin={0}
          aria-valuemax={question.timeLimitSeconds}
        >
          <div
            className="h-full bg-primary-500 transition-[width] duration-1000 ease-linear"
            style={{ width: `${timeFraction * 100}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default HostLiveRoomPage;