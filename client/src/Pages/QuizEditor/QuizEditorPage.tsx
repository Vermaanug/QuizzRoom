import Button from "#src/component/Button/Button";
import PageWrapper from "#src/component/PageWrapper/PageWrapper";
import QuestionForm from "./component/QuestionForm";
import { ArrowLeft, Plus } from "lucide-react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import useQuizEditor from "./hook/useQuizEditor";
import type { QuizEditorFormValues } from "./QuizEditor.types";
import toast from "react-hot-toast";

const defaultQuestion = {
  text: "",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  correctOption: "A" as const,
  timeLimitSeconds: 30 as const,
};

const QuizEditorPage = () => {
  const {
    states: { navigateTo, quizId },
    services: { getSingleQuizService },
    mutations: { quizQuestionsSaveMutation },
  } = useQuizEditor();

  const methods = useForm<QuizEditorFormValues>({
    defaultValues: {
      questions: [defaultQuestion],
    },
  });

  const { control, handleSubmit } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const quizTitle = getSingleQuizService?.data?.quiz?.title;

  const handleSaveQuiz = (data: QuizEditorFormValues) => {
    quizQuestionsSaveMutation
      .mutateAsync({ quizId, questions: data.questions })
      .then(() => {
        navigateTo({
          url: "dashboard",
          replace: true
        })
        toast.success("Quizz Update Successfully");
      });
  };

  const handleAddQuestion = () => {
    append(defaultQuestion);
  };

  return (
    <PageWrapper>
      <FormProvider {...methods}>
        <form
          noValidate
          onSubmit={handleSubmit(handleSaveQuiz)}
          className="space-y-10"
        >
          <header className="flex flex-col gap-4 border-b px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <button
                type="button"
                onClick={() => navigateTo({ url: "/dashboard" })}
                aria-label="Back to dashboard"
                className="flex h-10 w-10 shrink-0 items-center justify-center text-muted transition hover:text-ink focus:outline-none focus:ring-2 focus:ring-primary-700"
              >
                <ArrowLeft size={18} strokeWidth={1.8} aria-hidden="true" />
              </button>

              <h1 className="truncate font-display text-3xl uppercase tracking-[0.12em] text-ink">
                {quizTitle}
              </h1>
            </div>

            <Button type="submit" className="sm:w-auto" loading={quizQuestionsSaveMutation?.isPending}>
              Save Quiz
            </Button>
          </header>

          <section className="space-y-5 px-4">
            <div className="mx-auto w-1/2 flex flex-col gap-2">
              <div className="space-y-5">
                {fields.map((field, index) => (
                  <QuestionForm
                    key={field.id}
                    index={index}
                    questionNumber={index + 1}
                    onRemove={
                      fields.length > 1 ? () => remove(index) : undefined
                    }
                  />
                ))}
              </div>
              <Button type="button" onClick={handleAddQuestion}>
                <Plus size={20} strokeWidth={1.8} aria-hidden="true" />
                Add question
              </Button>
            </div>
          </section>
        </form>
      </FormProvider>
    </PageWrapper>
  );
};

export default QuizEditorPage;
