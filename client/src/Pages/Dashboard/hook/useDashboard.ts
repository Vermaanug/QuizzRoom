import QUERY_KEYS from "#src/config/constant/QUERY_KEYS";
import URLS from "#src/config/constant/URLS";
import queryClientGlobal from "#src/config/tanstack-query.config";
import useCurrentUser from "#src/services/user/useCurrentUser";
import { handleGlobalDeleteRequest, handleGlobalPostRequest } from "#src/services/apiRequest";
import {useGetAllQuizzesService} from "#src/services/quizzes/useQuizzeServices";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import useGlobalRoutesHandler from "#src/services/common/useGlobalRouteHandler";

const useDashboard = () => {
  const [isNewQuizOpen, setIsNewQuizOpen] = useState(false);

  const { navigateTo} = useGlobalRoutesHandler()
  const {
    service: { getCurrentUserService },
  } = useCurrentUser();



  const {
    services: { getAllQuizzesService },
  } = useGetAllQuizzesService();


  const logoutMutation = useMutation({
    mutationFn: () =>
      handleGlobalPostRequest({
        url: URLS.LOGOUT,
        data: {},
      }),
    onSuccess: async () => {
      await queryClientGlobal.invalidateQueries({
        queryKey: [QUERY_KEYS.CURRENT_USER],
      });
    },
  });

  const createQuizMutation = useMutation({
    mutationFn: (data: { title: string }) =>
      handleGlobalPostRequest<
        { message: string; success: boolean },
        { title: string }
      >({
        url: URLS.QUIZZES,
        data,
      }),
  });

  const quizDeleteMutation = useMutation({
    mutationFn: (quizId: string) =>
      handleGlobalDeleteRequest<
        { message: string; success: boolean },
        Record<string, never>
      >({
        url: `${URLS.QUIZZES}/${quizId}`,
        data: {},
      }),
  });

  const handleCreateQuiz = (data: { title: string }) => {
    createQuizMutation.mutateAsync(data).then((res) => {
      setIsNewQuizOpen(false);
      toast.success(res?.message || "Quiz created successfully");
      queryClientGlobal.invalidateQueries({
        queryKey: [QUERY_KEYS.QUIZZES],
      });
    });
  };

  const handleDeleteQuiz = (quizId: string) => {
    quizDeleteMutation.mutateAsync(quizId).then((res) => {
      toast.success(res?.message || "Quiz deleted successfully");
      queryClientGlobal.invalidateQueries({
        queryKey: [QUERY_KEYS.QUIZZES],
      });
    });
  }

  return {
    states: {
      isNewQuizOpen,
      setIsNewQuizOpen,
    },
    services: {
      getCurrentUserService,
      getAllQuizzesService,
    },
    mutations: {
      logoutMutation,
    },
    functions: {
      handleCreateQuiz,
      handleDeleteQuiz,
    },
    route: {
      navigateTo
    }
  };
};

export default useDashboard;
