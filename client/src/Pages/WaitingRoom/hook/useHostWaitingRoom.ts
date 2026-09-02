import URLS from "#src/config/constant/URLS";
import { handleGlobalPostRequest } from "#src/services/apiRequest";
import useGlobalRoutesHandler from "#src/services/common/useGlobalRouteHandler";
import useGetRoomService from "#src/services/room/useGetRoomService";
import { useRoomSocket } from "#src/services/socket/useRoomSocket";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast/headless";

interface Player {
  id: string;
  name: string;
}

const useHostWaitingRoom = () => {
  const { activeRoutes, navigate } = useGlobalRoutesHandler();

  const [players, setPlayers] = useState<Player[]>([]);
  const roomToken = activeRoutes[activeRoutes.length - 1];

  const {
    service: { getCurrentRoomService },
  } = useGetRoomService({
    inviteToken: roomToken ?? "",
  });

  const room = getCurrentRoomService.data?.room;

  const endRoomMutation = useMutation({
    mutationFn: (roomId: string) =>
      handleGlobalPostRequest({
        url: `${URLS.ROOM}/${roomId}/end`,
        data: {},
      }),
  });

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

  const { isConnected, startContest } = useRoomSocket({
    roomId: room?.id,
    auth: room?.id ? {} : null,
    onRoomState: handleRoomState,
    onParticipantJoined: handleParticipantJoined,
    onParticipantDisconnected: handleParticipantDisconnected,
    onContestStarted: () => {
      navigate(`/room/${roomToken}/quiz`);
    },
  });

  const handleEndRoom = useCallback(() => {
    if (!room?.id) return;

    const confirmed = window.confirm(
      "End this room? All participants will be disconnected and this can't be undone.",
    );
    if (!confirmed) return;

    endRoomMutation.mutate(room.id, {
      onSuccess: () => {
        toast.success("Room ended");
        navigate("/dashboard");
      },
      onError: () => {
        toast.error("Failed to end room, please try again");
      },
    });
  }, [room?.id, endRoomMutation, navigate]);

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
    functions: {
      startContest,
      handleEndRoom
    },
    mutations: {
      endRoomMutation,
    },
  };
};

export default useHostWaitingRoom;
