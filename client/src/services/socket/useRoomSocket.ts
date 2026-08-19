import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(
  /\/$/,
  "",
);

interface RoomParticipant {
  id: string;
  displayName: string;
}


type SocketAuth = Record<string, never> | { participantId: string };

interface UseRoomSocketOptions {
  roomId?: string;
  auth: SocketAuth | null;
  onParticipantJoined?: (participant: RoomParticipant) => void;
  onParticipantDisconnected?: (participantId: string) => void;
  onRoomState?: (participants: RoomParticipant[]) => void;
}

export const useRoomSocket = ({
  roomId,
  auth,
  onParticipantJoined,
  onParticipantDisconnected,
  onRoomState,
}: UseRoomSocketOptions) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!roomId || !auth) return;

    const socket = io(SOCKET_URL, {
      auth,
      withCredentials: true,
    });
    
    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("join_room", { roomId });
    });

    socket.on("disconnect", () => setIsConnected(false));

    socket.on(
      "participant_joined",
      ({ participant }: { participant: RoomParticipant }) => {
        onParticipantJoined?.(participant);
      },
    );

    socket.on(
      "participant_disconnected",
      ({ participantId }: { participantId: string }) => {
        onParticipantDisconnected?.(participantId);
      },
    );

    socket.on(
      "room_state",
      ({ participants }: { participants: RoomParticipant[] }) => {
        onRoomState?.(participants);
      },
    );

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
    // Reconnect only when the room or identity actually changes, not on
    // every render of the callback props.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, JSON.stringify(auth)]);

  return { isConnected };
};