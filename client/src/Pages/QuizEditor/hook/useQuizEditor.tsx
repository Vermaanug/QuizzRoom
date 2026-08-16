import useGlobalRoutesHandler from "#src/services/common/useGlobalRouteHandler";
import { useGetSingleQuizService } from "#src/services/quizzes/useQuizzeServices";
import { useMutation } from "@tanstack/react-query";
import type { QuestionInput } from "../QuizEditor.types";
import { handleGlobalPutRequest } from "#src/services/apiRequest";
import URLS from "#src/config/constant/URLS";

const useQuizEditor = () => {
  const { navigateTo, subRoute } = useGlobalRoutesHandler();

  const {
    services: { getSingleQuizService },
  } = useGetSingleQuizService({
    quizId: subRoute,
  });

  const quizQuestionsSaveMutation = useMutation({
    mutationFn: ({
      quizId,
      questions,
    }: {
      quizId: string;
      questions: QuestionInput[];
    }) =>
      handleGlobalPutRequest({
        url: `${URLS.QUIZZES}/${quizId}/questions`,
        data: { questions },
      }),
  });

  return {
    states: {
      navigateTo,
      quizId: subRoute,
    },
    services: {
      getSingleQuizService,
    },
    mutations: {
      quizQuestionsSaveMutation
    }
  };
};

export default useQuizEditor;
