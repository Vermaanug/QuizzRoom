import { useQuery } from "@tanstack/react-query";
import { handleGlobalGetRequestQuery } from "#src/services/apiRequest";
import URLS from "#src/config/constant/URLS";
import QUERY_KEYS from "#src/config/constant/QUERY_KEYS";

export interface PastRoom {
  id: string;
  inviteToken: string;
  status: string;

}

interface PastRoomsResponse {
  success: boolean;
  rooms: PastRoom[];
}

const useGetPastRoomsService = () => {
  const getPastRoomsService = useQuery({
    queryKey: [QUERY_KEYS.PAST_ROOMS],
    queryFn: ({ signal }) =>
      handleGlobalGetRequestQuery<PastRoomsResponse>({
        url: URLS.PAST_ROOMS,
        signal,
      }),
  });

  return {
    service: {
      getPastRoomsService,
    },
  };
};

export default useGetPastRoomsService;