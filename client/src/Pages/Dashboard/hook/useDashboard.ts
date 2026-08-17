import QUERY_KEYS from "#src/config/constant/QUERY_KEYS";
import URLS from "#src/config/constant/URLS";
import queryClientGlobal from "#src/config/tanstack-query.config";
import useCurrentUser from "#src/services/user/useCurrentUser";
import {
  handleGlobalDeleteRequest,
  handleGlobalPostRequest,
} from "#src/services/apiRequest";
import { useGetAllQuizzesService } from "#src/services/quizzes/useQuizzeServices";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import useGlobalRoutesHandler from "#src/services/common/useGlobalRouteHandler";

type TabKey = "all" | "published" | "draft";

const TABS: Array<{ key: TabKey; label: string }> = [
  { key: "all", label: "All" },
  { key: "published", label: "Published" },
  { key: "draft", label: "Draft" },
];

const useDashboard = () => {
  const [isNewQuizOpen, setIsNewQuizOpen] = useState(false);
  const [activeTab, setIsActiveTab] = useState(TABS[0]);

  const { navigateTo } = useGlobalRoutesHandler();
  const {
    service: { getCurrentUserService },
  } = useCurrentUser();

  const {
    services: { getAllQuizzesService },
  } = useGetAllQuizzesService({
    quizType: activeTab?.key,
  });

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
        {
          message: string;
          success: boolean;
          quiz: { id: string; title: string; status: string };
        },
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

  const quizPublishMutation = useMutation({
    mutationFn: (quizId: string) =>
      handleGlobalPostRequest<
        { id: string; title: string; status: string },
        Record<string, never>
      >({
        url: `${URLS.QUIZZES}/${quizId}/publish`,
        data: {},
      }),
  });

  const handleQuizPublish = ({ quizID }: { quizID: string }) => {
    quizPublishMutation.mutateAsync(quizID).then(() => {
      queryClientGlobal.invalidateQueries({
        queryKey: [QUERY_KEYS.QUIZZES],
      });
    });
  };

  const handleCreateQuiz = (data: { title: string }) => {
    createQuizMutation.mutateAsync(data).then((res) => {
      setIsNewQuizOpen(false);
      toast.success(res?.message || "Quiz created successfully");
      queryClientGlobal.invalidateQueries({
        queryKey: [QUERY_KEYS.QUIZZES],
      });
      if (res?.quiz?.id) {
        navigateTo({ url: `/quiz/${res.quiz.id}` });
      }
    });
  };

  const handleDeleteQuiz = (quizId: string) => {
    quizDeleteMutation.mutateAsync(quizId).then((res) => {
      toast.success(res?.message || "Quiz deleted successfully");
      queryClientGlobal.invalidateQueries({
        queryKey: [QUERY_KEYS.QUIZZES],
      });
    });
  };

  return {
    states: {
      isNewQuizOpen,
      setIsNewQuizOpen,
      activeTab,
      setIsActiveTab,
      TABS,
    },
    services: {
      getCurrentUserService,
      getAllQuizzesService,
    },
    mutations: {
      logoutMutation,
      quizPublishMutation,
      quizDeleteMutation
    },
    functions: {
      handleCreateQuiz,
      handleDeleteQuiz,
      handleQuizPublish
    },
    route: {
      navigateTo,
    },
  };
};

export default useDashboard;
