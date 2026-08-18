import { Check, Copy, Link as LinkIcon, Play, X } from "lucide-react";
import { useState } from "react";
import useHostWaitingRoom from "./hook/useHostWaitingRoom";

const DUMMY_PLAYERS = [
  { id: "1", name: "Maya Chen" },
  { id: "2", name: "James Kirk" },
  { id: "3", name: "Priya Patel" },
  { id: "4", name: "Tom Hendricks" },
  { id: "5", name: "Sophie Laurent" },
  { id: "6", name: "Nico Vasquez" },
  { id: "7", name: "Yuki Tanaka" },
  { id: "8", name: "Ben Okafor" },
  { id: "9", name: "Layla Hassan" },
];

const MIN_PLAYERS = 2;

function BrandMark() {
  return (
    <span className="inline-flex items-center gap-1 font-display text-xl uppercase tracking-[-0.03em] text-ink sm:text-[23px]">
      <span className="text-primary-500">QUIZ</span> BLITZ
      <b
        aria-hidden="true"
        className="ml-1 text-2xl not-italic text-primary-500"
      >
        ϟ
      </b>
    </span>
  );
}

function PlayerChip({ name }: { name: string }) {
  return (
    <div className="flex h-14 items-center gap-3 border bg-surface px-5">
      <span
        aria-hidden="true"
        className="h-2 w-2 shrink-0 rounded-full bg-primary-500"
      />
      <span className="truncate font-sans text-base text-ink">{name}</span>
    </div>
  );
}

const HostWaitingRoomPage = () => {
  const [players] = useState(DUMMY_PLAYERS);
  const [copied, setCopied] = useState(false);
  
  const {
    states: { roomToken },
  } = useHostWaitingRoom();

  const canStart = players.length >= MIN_PLAYERS;

  const roomCode = roomToken ?? "";
  const joinUrl = roomCode ? `${window.location.origin}/join/${roomCode}` : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
    } catch {
      // clipboard unavailable — ignore, UI still confirms visually
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const handleEndRoom = () => {
    // wire up real "end room" flow here
  };

  const handleStartQuiz = () => {
    if (!canStart) return;
    // wire up real "start quiz" flow here
  };

  return (
    <div className="min-h-screen bg-canvas font-sans text-ink">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Anton', sans-serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        :root {
          --canvas: #080909;
          --surface: #1e1e1e;
          --ink: #f2f2f0;
          --muted: #747474;
          --line: #292929;
        }
        .bg-canvas { background-color: var(--canvas); }
        .bg-surface { background-color: var(--surface); }
        .text-ink { color: var(--ink); }
        .text-muted { color: var(--muted); }
        .border { border-color: var(--line); }
      `}</style>

      <header className="flex h-16 items-center justify-between border-b px-5 sm:px-10">
        <BrandMark />
        <button
          type="button"
          onClick={handleEndRoom}
          className="inline-flex items-center gap-2 font-display text-xs uppercase tracking-[0.1em] text-muted transition hover:text-ink focus:outline-none focus:ring-2 focus:ring-primary-700"
        >
          <X className="h-4 w-4" aria-hidden="true" />
          End room
        </button>
      </header>

      <main className="mx-auto flex w-full max-w-[600px] flex-col items-center px-5 py-16 sm:px-10">
        <p className="font-display text-xs uppercase tracking-[0.12em] text-muted">
          Share this code to join
        </p>

        <div className="mt-5 flex w-full items-center justify-between border bg-surface px-6 py-6 sm:px-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <span
              className="font-display text-2xl text-muted sm:text-3xl"
              aria-hidden="true"
            >
              #
            </span>
            <span className="font-display text-3xl uppercase tracking-[0.05em] text-primary-500 sm:text-5xl">
              {roomCode}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy room code"
            className="flex h-10 w-10 shrink-0 items-center justify-center text-muted transition hover:text-ink focus:outline-none focus:ring-2 focus:ring-primary-700"
          >
            {copied ? (
              <Check className="h-5 w-5 text-primary-500" aria-hidden="true" />
            ) : (
              <Copy className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-muted">
          <LinkIcon className="h-4 w-4" aria-hidden="true" />
          <span className="font-sans">{joinUrl}</span>
        </div>

        <section
          aria-labelledby="players-joined-heading"
          className="mt-14 w-full border bg-[#141414]"
        >
          <div className="flex items-center justify-between border-b px-5 py-4">
            <h2
              id="players-joined-heading"
              className="font-display text-xs uppercase tracking-[0.12em] text-muted"
            >
              Players joined
            </h2>
            <span className="font-display text-lg text-primary-500">
              {players.length}
            </span>
          </div>

          <ul className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
            {players.map((player) => (
              <li key={player.id}>
                <PlayerChip name={player.name} />
              </li>
            ))}
          </ul>
        </section>

        <button
          type="button"
          onClick={handleStartQuiz}
          disabled={!canStart}
          className="mt-10 flex h-14 w-full items-center justify-center gap-3 bg-primary-500 px-5 font-display uppercase tracking-[0.12em] text-black shadow-button transition hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
          style={{
            boxShadow: canStart ? "0 0 40px rgba(198,255,0,0.35)" : "none",
          }}
        >
          <Play className="h-4 w-4 fill-black" aria-hidden="true" />
          Start quiz
        </button>

        <p className="mt-4 text-center text-sm text-muted">
          Minimum {MIN_PLAYERS} players to start
        </p>
      </main>
    </div>
  );
};

export default HostWaitingRoomPage;
