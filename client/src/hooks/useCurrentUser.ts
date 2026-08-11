import { useQuery } from "@tanstack/react-query";
import { handleGlobalGetRequestQuery } from "#src/services/apiRequest";
import URLS from "#src/config/constant/URLS";
import QUERY_KEYS from "#src/config/constant/QUERY_KEYS";

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
  queryKey: [QUERY_KEYS.CURRENT_USER],
  queryFn: ({ signal }) => handleGlobalGetRequestQuery<CurrentUserResponse>({
    url: URLS.CURRENT_USER,
    signal,
  }),
});

export default useCurrentUser;
