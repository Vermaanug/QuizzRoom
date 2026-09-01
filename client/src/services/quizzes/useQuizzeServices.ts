import { useQuery } from "@tanstack/react-query";
import { handleGlobalGetRequestQuery } from "../apiRequest";
import URLS from "#src/config/constant/URLS";
import QUERY_KEYS from "#src/config/constant/QUERY_KEYS";
import type { QuestionInput } from "#src/Pages/QuizEditor/QuizEditor.types";

export interface Quiz {
  id: string;
  title: string;
  status: "draft" | "published" | "archived";
  questionCount: number;
  createdAt: string;
  updatedAt: string;
}

export const useGetAllQuizzesService = ({ quizType }: { quizType: string }) => {
  const getAllQuizzesService = useQuery({
    queryKey: [QUERY_KEYS.QUIZZES, quizType],
    queryFn: () =>
      handleGlobalGetRequestQuery<{ quizzes: Quiz[] }>({
        url: URLS.QUIZZES,
        searchParams: {
          ...(quizType && {
            type: quizType
          })
        }
      }),
    enabled: !!quizType
  });

  return {
    services: {
      getAllQuizzesService,
    },
  };
};

export const useGetSingleQuizService = ({ quizId }: { quizId: string }) => {
  const getSingleQuizService = useQuery({
    queryKey: [QUERY_KEYS.QUIZZES, quizId],
    queryFn: () =>
      handleGlobalGetRequestQuery<{ quiz: Quiz }>({
        url: `${URLS.QUIZZES}/${quizId}`,
      }),
    enabled: !!quizId,
  });

  return {
    services: {
      getSingleQuizService,
    },
  };
};


export const useGetQuizQuestionsService = ({ quizId }: { quizId?: string }) => {
  const getQuizQuestionsService = useQuery({
    queryKey: [QUERY_KEYS.QUIZ_QUESTIONS, quizId],
    queryFn: () =>
      handleGlobalGetRequestQuery<{ questions: QuestionInput[] }>({ url: `${URLS.QUIZZES}/${quizId}/questions` }),
    enabled: !!quizId,
  });

  return {
    services: { getQuizQuestionsService },
  };
};