import { useQuery } from "@tanstack/react-query";
import { handleGlobalGetRequestQuery } from "../apiRequest";
import URLS from "#src/config/constant/URLS";
import QUERY_KEYS from "#src/config/constant/QUERY_KEYS";

interface Quiz {
  id: string;
  title: string;
  status: "draft" | "published" | "archived";
  createdAt: string;
  updatedAt: string;
}

export const useGetAllQuizzesService = () => {
  const getAllQuizzesService = useQuery({
    queryKey: [QUERY_KEYS.QUIZZES],
    queryFn: () =>
      handleGlobalGetRequestQuery<{ quizzes: Quiz[] }>({
        url: URLS.QUIZZES,
      }),
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

