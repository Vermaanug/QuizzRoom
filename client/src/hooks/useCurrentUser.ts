import { useQuery } from "@tanstack/react-query";
import { handleGlobalGetRequestQuery } from "#src/services/apiRequest";

export interface CurrentUser {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
}

interface CurrentUserResponse {
  success: boolean;
  user: CurrentUser;
}

const useCurrentUser = () => useQuery({
  queryKey: ["current-user"],
  queryFn: ({ signal }) => handleGlobalGetRequestQuery<CurrentUserResponse>({
    url: "/api/auth/me",
    signal,
  }),
});

export default useCurrentUser;
