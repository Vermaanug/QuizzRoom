import URLS from "#src/config/constant/URLS";
import { handleGlobalPostRequest } from "#src/services/apiRequest";
import { useMutation } from "@tanstack/react-query";

const useParticipantRoom = () => {
  const joinRoomParticipant = useMutation({
    mutationFn: ({
      token,
      displayName,
    }: {
      token: string;
      displayName: boolean;
    }) =>
      handleGlobalPostRequest({
        url: `${URLS.ROOM}/${token}/rooms`,
        data: {
          displayName,
        },
      }),
  });

  return {
    mutations: {
      joinRoomParticipant,
    },
  };
};

export default useParticipantRoom;
