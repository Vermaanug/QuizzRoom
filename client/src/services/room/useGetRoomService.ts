import { useQuery, type QueryFunctionContext } from "@tanstack/react-query";
import { handleGlobalGetRequestQuery } from "#src/services/apiRequest";
import URLS from "#src/config/constant/URLS";
import QUERY_KEYS from "#src/config/constant/QUERY_KEYS";

export interface RoomLookup {
  id: string;
  inviteToken: string;
  status: "waiting" | "in_progress" | "completed";
  allowAnonymous: boolean;
  quizTitle: string | null;
  participantCount: number;
}

interface IRoomLookupResponse {
  room: RoomLookup;
}


export const getRoomQueryOptions = (inviteToken: string) => ({
  queryKey: [QUERY_KEYS.CURRENT_ROOM, inviteToken],
  queryFn: ({ signal }: QueryFunctionContext) =>
    handleGlobalGetRequestQuery<IRoomLookupResponse>({
      url: `${URLS.ROOM}/${inviteToken}`,
      signal,
    }),
});

const useGetRoomService = ({ inviteToken }: { inviteToken: string }) => {
  const getCurrentRoomService = useQuery({
    ...getRoomQueryOptions(inviteToken),
    enabled: Boolean(inviteToken),
  });

  return {
    service: {
      getCurrentRoomService,
    },
  };
};

export default useGetRoomService;