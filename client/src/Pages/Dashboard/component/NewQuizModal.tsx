import { useForm } from "react-hook-form";
import Button from "#src/component/Button/Button";
import TextInput from "#src/component/Form/TextInput";
import Modal from "#src/component/Modal/Modal";

interface NewQuizFormValues {
  title: string;
}

interface NewQuizModalProps {
  isOpen: boolean;
  handleClose: () => void;
  onCreate: (values: NewQuizFormValues) => void | Promise<void>;
}

const NewQuizModal = ({ isOpen, handleClose , onCreate }: NewQuizModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<NewQuizFormValues>({
    defaultValues: {
      title: "",
    },
  });

  const closeModal = () => {
    reset();
    handleClose();
  };

  const submit = handleSubmit(async (values) => {
    await onCreate(values);
    closeModal();
  });

  return (
    <Modal
      description="Start with a draft quiz title. You can add questions on the next screen."
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            className="inline-flex h-12 items-center justify-center border px-5 font-display text-sm uppercase tracking-[0.12em] text-ink transition hover:border-muted focus:outline-none focus:ring-2 focus:ring-primary-700"
            onClick={closeModal}
            type="button"
          >
            Cancel
          </button>
          <Button className="w-full sm:w-auto sm:px-7" form="new-quiz-form" loading={isSubmitting} type="submit">
            Create draft
          </Button>
        </div>
      }
      onClose={closeModal}
      open={isOpen}
      title="New Quiz"
    >
      <form className="space-y-5" id="new-quiz-form" onSubmit={submit}>
        <div>
          <TextInput
            id="quiz-name"
            label="Quiz name"
            placeholder="Enter quiz name"
            registration={register("title", { required: true })}
          />
          <p className="mt-2 text-xs text-muted">Status will be set to Draft automatically.</p>
        </div>
      </form>
    </Modal>
  );
};

export default NewQuizModal;