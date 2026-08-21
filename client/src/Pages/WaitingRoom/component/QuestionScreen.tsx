import BrandMark from "#src/component/Brand/BrandMark";
import type { LiveQuestion } from "#src/services/socket/useRoomSocket";
import { useEffect, useState } from "react";

interface QuestionScreenProps {
  name: string;
  score: number;
  question: LiveQuestion;
  correctOption: string | null;
  onSelect: (optionId: string) => void;
}

const OPTION_ACCENTS: Record<string, string> = {
  A: "text-primary-600",
  B: "text-primary-500",
  C: "text-success",
  D: "text-danger",
};

const OPTION_KEYS = ["A", "B", "C", "D"] as const;

const QuestionScreen = ({
  name,
  score,
  question,
  correctOption,
  onSelect,
}: QuestionScreenProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    setSelectedId(null);

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
  }, [question.id, question.endsAt]);

  const timeIsUp = remainingSeconds <= 0;
  const revealed = correctOption !== null;
  const locked = timeIsUp || selectedId !== null || revealed;
  const timeFraction = Math.min(
    1,
    Math.max(0, remainingSeconds / question.timeLimitSeconds),
  );

  const optionLabel: Record<string, string> = {
    A: question.optionA,
    B: question.optionB,
    C: question.optionC,
    D: question.optionD,
  };

  const handleSelect = (optionId: string) => {
    if (locked) return;
    setSelectedId(optionId);
    onSelect(optionId);
  };

  return (
    <div className="min-h-screen bg-canvas">
      <header className="flex h-16 items-center justify-between border-b px-5 sm:px-10">
        <span className="text-sm text-muted">{name.trim() || "Player"}</span>
        <BrandMark size="text-lg" />
        <span className="font-mono text-sm font-semibold text-primary-500">
          {score} pts
        </span>
      </header>

      <div
        className="h-1 w-full bg-line"
        role="progressbar"
        aria-label="Time remaining"
        aria-valuenow={remainingSeconds}
        aria-valuemin={0}
        aria-valuemax={question.timeLimitSeconds}
      >
        <div
          className="h-full bg-primary-500 transition-[width] duration-1000 ease-linear"
          style={{ width: `${timeFraction * 100}%` }}
        />
      </div>

      <main className="mx-auto flex w-full max-w-[900px] flex-col items-center px-5 py-16 sm:px-10">
        <p className="font-display text-xs uppercase tracking-[0.12em] text-muted">
          Question {question.index} of {question.total}
        </p>

        <div
          aria-label={timeIsUp ? "Time's up" : "Time remaining"}
          role="status"
          className="mt-6 flex h-24 w-24 items-center justify-center rounded-full border-2 border-primary-500"
        >
          <span className="font-display text-3xl text-primary-500">
            {remainingSeconds}
          </span>
        </div>

        <h1 className="mt-8 text-center font-display text-2xl uppercase leading-tight text-ink sm:text-3xl">
          {question.text}
        </h1>

        {question.codeSnippet && (
          <pre className="mt-6 w-full overflow-x-auto border bg-surface p-4 text-left font-mono text-sm text-ink">
            <code>{question.codeSnippet}</code>
          </pre>
        )}

        <div className="mt-10 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          {OPTION_KEYS.map((optionId) => {
            const isSelected = optionId === selectedId;
            const isCorrectAnswer = revealed && optionId === correctOption;
            const isWrongSelected = revealed && isSelected && !isCorrectAnswer;

            return (
              <button
                key={optionId}
                type="button"
                onClick={() => handleSelect(optionId)}
                disabled={locked}
                aria-pressed={isSelected}
                className={`flex h-16 items-center gap-3 border px-5 text-left transition focus:outline-none focus:ring-2 focus:ring-primary-700 ${
                  isCorrectAnswer
                    ? "border-success bg-success/10"
                    : isWrongSelected
                      ? "border-danger bg-danger/10"
                      : isSelected
                        ? "border-primary-500 bg-primary-500/10"
                        : "border-line bg-surface hover:border-muted"
                } disabled:cursor-default`}
              >
                <span
                  className={`font-display text-base ${OPTION_ACCENTS[optionId] ?? "text-ink"}`}
                >
                  {optionId}
                </span>
                <span className="text-base text-ink">{optionLabel[optionId]}</span>
              </button>
            );
          })}
        </div>

        {timeIsUp && !revealed && (
          <p
            role="status"
            className="mt-14 font-display text-lg uppercase tracking-[0.08em] text-danger"
          >
            Time&rsquo;s up!
          </p>
        )}

        {revealed && (
          <p
            role="status"
            className="mt-14 font-display text-lg uppercase tracking-[0.08em] text-muted"
          >
            Waiting for the next question&hellip;
          </p>
        )}
      </main>
    </div>
  );
};

export default QuestionScreen;