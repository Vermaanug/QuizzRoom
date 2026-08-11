import { QueryClient } from "@tanstack/react-query";

const queryClientGlobal = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export default queryClientGlobal;
