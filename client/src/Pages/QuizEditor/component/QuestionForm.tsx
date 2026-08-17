import { ChevronDown, Trash2 } from "lucide-react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import type {
  CorrectOption,
  QuizEditorFormValues,
  TimeLimit,
} from "#src/Pages/QuizEditor/QuizEditor.types";
import Button from "#src/component/Button/Button";
import Select from "#src/component/Select/Select";

interface QuestionFormProps {
  index: number;
  questionNumber: number;
  onRemove?: () => void;
}

const options: Array<{
  key: CorrectOption;
  field: "optionA" | "optionB" | "optionC" | "optionD";
}> = [
  { key: "A", field: "optionA" },
  { key: "B", field: "optionB" },
  { key: "C", field: "optionC" },
  { key: "D", field: "optionD" },
];

const timeLimits: TimeLimit[] = [30, 60];

const QuestionForm = ({
  index,
  questionNumber,
  onRemove,
}: QuestionFormProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<QuizEditorFormValues>();

  const correctOption = useWatch({
    name: `questions.${index}.correctOption`,
  });

  const questionText = useWatch({
    name: `questions.${index}.text`,
  });

  const questionErrors = errors.questions?.[index];
  const hasErrors = Boolean(questionErrors);

  const fieldName = (field: keyof QuizEditorFormValues["questions"][number]) =>
    `questions.${index}.${field}` as const;

  return (
    <Disclosure as="article" defaultOpen className="border bg-surface">
      <div className="flex min-h-14 items-stretch justify-between border-b">
        <DisclosureButton className="group flex min-w-0 flex-1 items-center gap-3 px-4 py-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-primary-700 sm:px-5">
          <span className="shrink-0 font-display text-sm uppercase tracking-[0.12em] text-muted">
            {questionNumber}
          </span>

          <span className="min-w-0 flex-1 truncate font-display text-sm uppercase tracking-[0.1em] text-ink">
            {questionText?.trim() ? questionText : "Question"}
          </span>

          {hasErrors && (
            <span
              aria-hidden="true"
              className="h-2 w-2 shrink-0 rounded-full bg-danger"
            />
          )}

          <ChevronDown
            size={18}
            strokeWidth={1.8}
            aria-hidden="true"
            className="shrink-0 text-muted transition duration-200 group-data-open:rotate-180 group-data-open:text-primary-500"
          />
        </DisclosureButton>

        {onRemove && questionNumber > 1 && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Delete question ${questionNumber}`}
            className="flex h-14 w-14 shrink-0 items-center justify-center border-l text-muted transition hover:text-danger focus:outline-none focus:ring-2 focus:ring-primary-700"
          >
            <Trash2 size={18} strokeWidth={1.8} aria-hidden="true" />
          </button>
        )}
      </div>

      <DisclosurePanel className="space-y-7 p-4 sm:p-5">
        <div>
          <label
            htmlFor={`question-${index}`}
            className="mb-2 block font-display text-xs uppercase tracking-[0.12em] text-muted"
          >
            Question
          </label>

          <textarea
            id={`question-${index}`}
            rows={1}
            placeholder="Type the question..."
            aria-invalid={Boolean(questionErrors?.text)}
            aria-describedby={
              questionErrors?.text ? `question-${index}-error` : undefined
            }
            className={`w-full resize-y border bg-canvas px-5 py-4 text-base text-ink outline-none placeholder:text-muted focus:border-primary-700 ${
              questionErrors?.text ? "border-danger" : ""
            }`}
            {...register(fieldName("text"), {
              required: "Question text is required",
            })}
          />

          {questionErrors?.text && (
            <p
              id={`question-${index}-error`}
              role="alert"
              className="mt-2 text-xs font-medium text-danger"
            >
              {questionErrors.text.message}
            </p>
          )}
        </div>

        <fieldset>
          <legend className="mb-3 font-display text-xs uppercase tracking-[0.12em] text-muted">
            Answers
          </legend>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {options.map(({ key, field }) => {
              const optionError = questionErrors?.[field];
              const isCorrect = correctOption === key;

              return (
                <div key={key} className="flex min-w-0 items-stretch">
                  <label
                    htmlFor={`correct-${index}-${key}`}
                    className={`flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center border border-r-0 transition ${
                      isCorrect
                        ? "border-primary-500 bg-primary-500 text-black"
                        : "border-line bg-canvas text-muted hover:text-ink"
                    }`}
                    title={`Mark option ${key} as correct`}
                  >
                    <input
                      id={`correct-${index}-${key}`}
                      type="radio"
                      value={key}
                      aria-label={`Mark option ${key} as correct`}
                      className="sr-only"
                      {...register(fieldName("correctOption"))}
                    />

                    <span aria-hidden="true" className="font-display text-sm">
                      {key}
                    </span>
                  </label>

                  <div className="min-w-0 flex-1">
                    <label
                      htmlFor={`option-${index}-${key}`}
                      className="sr-only"
                    >
                      Option {key}
                    </label>

                    <input
                      id={`option-${index}-${key}`}
                      type="text"
                      placeholder={`Option ${key}`}
                      aria-invalid={Boolean(optionError)}
                      aria-describedby={
                        optionError ? `option-${index}-${key}-error` : undefined
                      }
                      className={`h-14 w-full border bg-canvas px-5 text-ink outline-none placeholder:text-muted focus:border-primary-700 ${
                        optionError ? "border-danger" : ""
                      }`}
                      {...register(fieldName(field), {
                        required: `Option ${key} is required`,
                      })}
                    />

                    {optionError && (
                      <p
                        id={`option-${index}-${key}-error`}
                        role="alert"
                        className="mt-1 text-xs font-medium text-danger"
                      >
                        {optionError.message}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {questionErrors?.correctOption && (
            <p role="alert" className="mt-2 text-xs font-medium text-danger">
              {questionErrors.correctOption.message}
            </p>
          )}
        </fieldset>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label
            htmlFor={`time-limit-${index}`}
            className="font-display text-xs uppercase tracking-[0.12em] text-muted"
          >
            Time limit
          </label>

          <Controller
            name={fieldName("timeLimitSeconds")}
            render={({ field: { value, onChange } }) => (
              <Select
                value={value}
                onChange={onChange}
                aria-label="Time limit"
                className="sm:w-36"
                options={timeLimits.map((seconds) => ({
                  value: seconds,
                  label: `${seconds}s`,
                }))}
              />
            )}
          />
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
};

export default QuestionForm;
