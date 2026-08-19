import useGlobalRoutesHandler from "#src/services/common/useGlobalRouteHandler";
import useGetRoomService from "#src/services/room/useGetRoomService";
import { useRoomSocket } from "#src/services/socket/useRoomSocket";
import { useCallback, useState } from "react";

interface Player {
  id: string;
  name: string;
}

const useHostWaitingRoom = () => {
  const { activeRoutes } = useGlobalRoutesHandler();

  const [players, setPlayers] = useState<Player[]>([]);
  const roomToken = activeRoutes[activeRoutes.length - 1];

  const {
    service: { getCurrentRoomService },
  } = useGetRoomService({
    inviteToken: roomToken ?? "",
  });

  const room = getCurrentRoomService.data?.room;

  const handleRoomState = useCallback(
    (participants: { id: string; displayName: string }[]) => {
      setPlayers(participants.map((p) => ({ id: p.id, name: p.displayName })));
    },
    [],
  );

  const handleParticipantJoined = useCallback(
    (participant: { id: string; displayName: string }) => {
      setPlayers((prev) => {
        if (prev.some((p) => p.id === participant.id)) return prev;
        return [...prev, { id: participant.id, name: participant.displayName }];
      });
    },
    [],
  );

  const handleParticipantDisconnected = useCallback((participantId: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== participantId));
  }, []);

  const { isConnected } = useRoomSocket({
    roomId: room?.id,
    auth: room?.id ? {} : null,
    onRoomState: handleRoomState,
    onParticipantJoined: handleParticipantJoined,
    onParticipantDisconnected: handleParticipantDisconnected,
  });

  return {
    services: {
      getCurrentRoomService,
    },
    states: {
      roomToken,
      room,
      players,
      isSocketConnected: isConnected,
    },
  };
};

export default useHostWaitingRoom;
