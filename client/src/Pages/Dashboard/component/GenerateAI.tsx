import Button from "#src/component/Button/Button";
import { Sparkles, WandSparkles } from "lucide-react";
import { useForm } from "react-hook-form";

const QUICK_PROMPTS = [
  "JavaScript async/await & Promises",
  "React Hooks for beginners",
  "Python data structures",
  "SQL JOINs and aggregation",
  "CSS Grid & Flexbox",
  "TypeScript generics",
];

const QUESTION_COUNTS = [5, 10, 15] as const;

const DIFFICULTIES = ["easy", "medium", "hard"] as const;

type Difficulty = (typeof DIFFICULTIES)[number];

interface GenerateAIFormValues {
  prompt: string;
  questionCount: number;
  difficulty: Difficulty;
}

interface GenerateAIPageProps {
  onGenerate?: (payload: GenerateAIFormValues) => void;
  isLoading?: boolean
}

const GenerateAIPage = ({ onGenerate, isLoading }: GenerateAIPageProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
  } = useForm<GenerateAIFormValues>({
    defaultValues: {
      prompt: "",
      questionCount: 5,
      difficulty: "medium",
    },
  });

  const prompt = watch("prompt");
  const questionCount = watch("questionCount");
  const difficulty = watch("difficulty");

  const onSubmit = (data: GenerateAIFormValues) => {
    if (!data.prompt.trim()) return;

    onGenerate?.({
      ...data,
      prompt: data.prompt.trim(),
    });
  };

  const handleQuickPrompt = (value: string) => {
    setValue("prompt", `Create a quiz on ${value}`, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  return (
    <section className="mt-8 w-full">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-primary-700 bg-primary-500/[0.05] text-primary-500">
          <WandSparkles
            size={23}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </div>

        <div>
          <h1 className="font-display text-3xl uppercase leading-none tracking-[-0.025em] text-ink sm:text-4xl">
            Generate with AI
          </h1>

          <p className="mt-1.5 text-sm text-muted sm:text-base">
            Describe a topic and let AI create your quiz.
          </p>
        </div>
      </div>

      {/* Generator */}
      <div className="mx-auto mt-7 w-full max-w-[960px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Prompt */}
          <div className="relative">
            <label
              htmlFor="quiz-prompt"
              className="sr-only"
            >
              Describe the quiz you want to generate
            </label>

            <textarea
              id="quiz-prompt"
              maxLength={1000}
              rows={4}
              placeholder="e.g. Create a quiz on JavaScript async/await for intermediate developers..."
              {...register("prompt", {
                required: "Please describe the quiz you want to generate.",
                maxLength: {
                  value: 1000,
                  message: "Prompt cannot exceed 1000 characters.",
                },
              })}
              className="min-h-[140px] w-full resize-none border bg-surface px-5 py-4 pb-8 text-sm leading-6 text-ink outline-none transition placeholder:text-muted/90 focus:border-primary-700"
            />

            <span
              aria-live="polite"
              className="absolute bottom-3 right-4 text-[11px] text-muted"
            >
              {prompt?.length ?? 0}/1000
            </span>
          </div>

          {/* Quick prompts */}
          <div className="mt-6">
            <h2 className="font-display text-xs uppercase tracking-[0.14em] text-muted">
              Quick prompts
            </h2>

            <div className="mt-3 flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((quickPrompt) => (
                <button
                  key={quickPrompt}
                  type="button"
                  onClick={() => handleQuickPrompt(quickPrompt)}
                  className="border bg-surface px-3 py-2 font-sans text-xs text-muted transition hover:border-primary-700 hover:text-ink focus:outline-none focus:ring-2 focus:ring-primary-700"
                >
                  {quickPrompt}
                </button>
              ))}
            </div>
          </div>

          {/* Configuration */}
          <div className="my-6 border bg-surface p-4 sm:p-5">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              {/* Question count */}
              <fieldset>
                <legend className="font-display text-xs uppercase tracking-[0.14em] text-muted">
                  Questions
                </legend>

                <div className="mt-3 flex gap-2">
                  {QUESTION_COUNTS.map((count) => {
                    const isSelected = questionCount === count;

                    return (
                      <button
                        key={count}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() =>
                          setValue("questionCount", count, {
                            shouldDirty: true,
                            shouldTouch: true,
                          })
                        }
                        className={`flex h-10 min-w-12 items-center justify-center border px-4 font-display text-sm uppercase tracking-[0.08em] transition focus:outline-none focus:ring-2 focus:ring-primary-700 ${
                          isSelected
                            ? "border-primary-500 bg-primary-500 text-black"
                            : "border-line bg-canvas text-muted hover:border-muted hover:text-ink"
                        }`}
                      >
                        {count}
                      </button>
                    );
                  })}
                </div>

                {/* Hidden RHF field */}
                <input
                  type="hidden"
                  {...register("questionCount", {
                    valueAsNumber: true,
                  })}
                />
              </fieldset>

              <div className="hidden h-12 w-px bg-line sm:block" />

              {/* Difficulty */}
              <fieldset>
                <legend className="font-display text-xs uppercase tracking-[0.14em] text-muted">
                  Difficulty
                </legend>

                <div className="mt-3 flex gap-2">
                  {DIFFICULTIES.map((level) => {
                    const isSelected = difficulty === level;

                    return (
                      <button
                        key={level}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() =>
                          setValue("difficulty", level, {
                            shouldDirty: true,
                            shouldTouch: true,
                          })
                        }
                        className={`flex h-10 min-w-20 items-center justify-center border px-4 font-display text-xs uppercase tracking-[0.1em] transition focus:outline-none focus:ring-2 focus:ring-primary-700 ${
                          isSelected
                            ? "border-primary-500 bg-primary-500/[0.08] text-primary-500"
                            : "border-line bg-canvas text-muted hover:border-muted hover:text-ink"
                        }`}
                      >
                        {level}
                      </button>
                    );
                  })}
                </div>

                {/* Hidden RHF field */}
                <input
                  type="hidden"
                  {...register("difficulty")}
                />
              </fieldset>
            </div>
          </div>

          {/* Generate */}
          <Button
            type="submit"
            disabled={!prompt?.trim()}
            className="w-full gap-3"
            loading={isLoading}
          >
            <Sparkles
              size={18}
              strokeWidth={2}
              aria-hidden="true"
            />

            Generate quiz
          </Button>
        </form>
      </div>
    </section>
  );
};

export default GenerateAIPage;