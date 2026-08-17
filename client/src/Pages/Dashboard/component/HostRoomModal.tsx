import { useForm } from "react-hook-form";
import Modal from "#src/component/Modal/Modal";
import Button from "#src/component/Button/Button";
import type { Quiz } from "#src/services/quizzes/useQuizzeServices";
import { Check } from "lucide-react";

interface HostRoomFormValues {
  allowAnonymousPlayers: boolean;
}

interface HostRoomModalProps {
  isOpen: boolean;
  handleClose: () => void;
  quiz: Quiz;
  onGenerateRoom: (values: {
    quizId: string;
    allowAnonymousPlayers: boolean;
  }) => void | Promise<void>;
  isLoading: boolean;
}

const HostRoomModal = ({
  isOpen,
  handleClose,
  quiz,
  onGenerateRoom,
  isLoading,
}: HostRoomModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
  } = useForm<HostRoomFormValues>({
    defaultValues: {
      allowAnonymousPlayers: true,
    },
  });

  const allowAnonymousPlayers = watch("allowAnonymousPlayers");

  const closeModal = () => {
    if (isLoading) return;
    reset({
      allowAnonymousPlayers: true,
    });
    handleClose();
  };

  const onSubmit = async (values: HostRoomFormValues) => {
    await onGenerateRoom({
      quizId: quiz.id,
      allowAnonymousPlayers: values.allowAnonymousPlayers,
    });
  };

  return (
    <Modal
      description="Pick a quiz, configure access, and go live."
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            className="inline-flex h-14 items-center justify-center border px-7 font-display text-sm uppercase tracking-[0.1em] text-ink transition hover:border-muted focus:outline-none focus:ring-2 focus:ring-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isLoading}
            onClick={closeModal}
            type="button"
          >
            Cancel
          </button>

          <Button
            className="w-full sm:w-auto sm:px-7"
            loading={isLoading}
            onClick={handleSubmit(onSubmit)}
            type="button"
          >
            Generate room &amp; invite link
          </Button>
        </div>
      }
      onClose={closeModal}
      open={isOpen}
      title="Host a room"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <section aria-labelledby="selected-quiz-heading">
            <h2
              className="mb-3 font-display text-sm uppercase tracking-[0.12em] text-muted"
              id="selected-quiz-heading"
            >
              Selected quiz
            </h2>

            <div
              aria-label={`${quiz.title}, ${quiz.questionCount} questions, selected`}
              className="border border-primary-500 bg-canvas px-4 py-4"
              role="status"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-primary-500"
                >
                  <span className="h-3.5 w-3.5 rounded-full bg-primary-500" />
                </span>

                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-lg leading-none text-ink">
                    {quiz.title}
                  </h3>

                  <p className="mt-1.5 text-sm text-muted">
                    {quiz.questionCount}{" "}
                    {quiz.questionCount === 1
                      ? "question"
                      : "questions"}
                  </p>
                </div>

                <Check
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 text-primary-500"
                  strokeWidth={2.5}
                />
              </div>
            </div>
          </section>

          <section className="border bg-surface px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h2 className="font-display text-sm uppercase tracking-[0.08em] text-ink">
                  Allow anonymous players
                </h2>

                <p className="mt-1 text-xs leading-5 text-muted">
                  Players can join without logging in
                </p>
              </div>

              <label className="relative flex h-10 w-[76px] shrink-0 cursor-pointer items-center rounded-full p-1">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  {...register("allowAnonymousPlayers")}
                />

                <span
                  className={`absolute inset-0 rounded-full transition ${
                    allowAnonymousPlayers
                      ? "bg-primary-500"
                      : "bg-line"
                  }`}
                />

                <span
                  className={`relative z-10 h-8 w-8 rounded-full bg-ink transition-transform ${
                    allowAnonymousPlayers
                      ? "translate-x-9"
                      : "translate-x-0"
                  }`}
                />
              </label>
            </div>
          </section>
        </div>
      </form>
    </Modal>
  );
};

export default HostRoomModal;