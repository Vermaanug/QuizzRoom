import BrandMark from "#src/component/Brand/BrandMark";
import { Check } from "lucide-react";
import { useState } from "react";

interface QuestionScreenProps {
  name: string;
  score: number;
  onNext: () => void;
}

export const ROOM_CODE = "NOVA-7831";

export const DUMMY_PLAYER_COUNT = 10;

export const DUMMY_QUESTION = {
  index: 1,
  total: 4,
  prompt: "Which civilization built the Great Pyramid of Giza?",
  options: [
    { id: "A", label: "Mesopotamians" },
    { id: "B", label: "Egyptians" },
    { id: "C", label: "Greeks" },
    { id: "D", label: "Romans" },
  ],
  correctOptionId: "B",
} as const;

export const OPTION_ACCENTS: Record<string, string> = {
  A: "text-primary-600",
  B: "text-primary-500",
  C: "text-success",
  D: "text-danger",
};

const QuestionScreen = ({
  name,
  score,
  onNext,
}: QuestionScreenProps) => {
  const [selectedId, setSelectedId] = useState("B");

  // Replace with the real timer/socket state.
  const timeIsUp = true;

  return (
    <div className="min-h-screen bg-canvas">
      <header className="flex h-16 items-center justify-between border-b px-5 sm:px-10">
        <span className="text-sm text-muted">
          {name.trim() || "Player"}
        </span>

        <BrandMark size="text-lg" />

        <span className="font-mono text-sm font-semibold text-danger">
          {score} pts
        </span>
      </header>

      <main className="mx-auto flex w-full max-w-[900px] flex-col items-center px-5 py-16 sm:px-10">
        <p className="font-display text-xs uppercase tracking-[0.12em] text-muted">
          Question {DUMMY_QUESTION.index} of {DUMMY_QUESTION.total}
        </p>

        <div
          aria-label={timeIsUp ? "Time's up" : "Time remaining"}
          role="status"
          className="mt-6 flex h-24 w-24 items-center justify-center rounded-full border-2 border-danger"
        >
          <span className="font-display text-3xl text-danger">
            0
          </span>
        </div>

        <h1 className="mt-8 text-center font-display text-2xl uppercase leading-tight text-ink sm:text-3xl">
          {DUMMY_QUESTION.prompt}
        </h1>

        <div className="mt-10 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          {DUMMY_QUESTION.options.map((option) => {
            const isSelected = option.id === selectedId;
            const isCorrect =
              option.id === DUMMY_QUESTION.correctOptionId;

            const revealCorrect =
              timeIsUp && isSelected && isCorrect;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() =>
                  !timeIsUp && setSelectedId(option.id)
                }
                disabled={timeIsUp}
                aria-pressed={isSelected}
                className={`flex h-16 items-center justify-between border px-5 text-left transition focus:outline-none focus:ring-2 focus:ring-primary-700 ${
                  revealCorrect
                    ? "border-success bg-success/10"
                    : "border-line bg-surface hover:border-muted"
                } disabled:cursor-default`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`font-display text-base ${
                      OPTION_ACCENTS[option.id] ?? "text-ink"
                    }`}
                  >
                    {option.id}
                  </span>

                  <span className="text-base text-ink">
                    {option.label}
                  </span>
                </span>

                {revealCorrect && (
                  <Check
                    className="h-5 w-5 text-success"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>

        {timeIsUp && (
          <p
            role="status"
            className="mt-14 font-display text-lg uppercase tracking-[0.08em] text-danger"
          >
            Time&rsquo;s up!
          </p>
        )}

        <button
          type="button"
          onClick={onNext}
          className="mt-6 flex h-14 w-full items-center justify-center gap-2 bg-primary-500 px-5 font-display uppercase tracking-[0.12em] text-black shadow-button transition hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-700"
        >
          Next question
          <span aria-hidden="true">&gt;</span>
        </button>
      </main>
    </div>
  );
};

export default QuestionScreen;