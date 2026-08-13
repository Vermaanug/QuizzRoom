import QUERY_KEYS from "#src/config/constant/QUERY_KEYS";
import URLS from "#src/config/constant/URLS";
import queryClientGlobal from "#src/config/tanstack-query.config";
import useCurrentUser from "#src/hooks/useCurrentUser";
import { handleGlobalPostRequest } from "#src/services/apiRequest";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

const useDashboard = () => {
  const [isNewQuizOpen, setIsNewQuizOpen] = useState(false);
  const {
    service: { getCurrentUserService },
  } = useCurrentUser();

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

  const handleCreateQuiz = (data: { title: string }) => {
    createQuizMutation.mutateAsync(data).then((res) => {
      setIsNewQuizOpen(false);
      toast.success(res?.message || "Quiz created successfully");
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
    },
    mutations: {
      logoutMutation,
    },
    functions: {
      handleCreateQuiz,
    },
  };
};

export default useDashboard;
