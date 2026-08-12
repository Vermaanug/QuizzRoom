import QUERY_KEYS from "#src/config/constant/QUERY_KEYS";
import URLS from "#src/config/constant/URLS";
import queryClientGlobal from "#src/config/tanstack-query.config";
import useCurrentUser from "#src/hooks/useCurrentUser";
import { handleGlobalPostRequest } from "#src/services/apiRequest";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

const useDashboard = () => {
  const [isNewQuizOpen, setIsNewQuizOpen] = useState(false);
  const {
    service: { getCurrentUserService },
  } = useCurrentUser();

  const logoutMutation = useMutation({
    mutationFn: () =>
      handleGlobalPostRequest<
        { success: boolean; message: string },
        Record<string, never>
      >({
        url: URLS.LOGOUT,
        data: {},
      }),
    onSuccess: async () => {
      await queryClientGlobal.invalidateQueries({
        queryKey: [QUERY_KEYS.CURRENT_USER],
      });
    },
  });

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
  };
};

export default useDashboard;
