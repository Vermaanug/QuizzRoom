import useGlobalRoutesHandler from "#src/services/common/useGlobalRouteHandler";
import useGetRoomService from "#src/services/room/useGetRoomService";

const useHostWaitingRoom = () => {
  const { activeRoutes } = useGlobalRoutesHandler();

  const roomToken = activeRoutes[activeRoutes.length - 1];

  const {
    service: { getCurrentRoomService },
  } = useGetRoomService({
    inviteToken: roomToken ?? "",
  });

  return {
    services: {
        getCurrentRoomService
    },
    states: {
        roomToken
    }
  };
};

export default useHostWaitingRoom;