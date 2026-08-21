import BrandMark from "#src/component/Brand/BrandMark";
import URLS from "#src/config/constant/URLS";
import { handleGlobalPostRequest } from "#src/services/apiRequest";
import useGlobalRoutesHandler from "#src/services/common/useGlobalRouteHandler";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import TextInput from "#src/component/Form/TextInput";
import toast from "react-hot-toast";

interface JoinRoomFormValues {
  displayName: string;
}

// Matches MappedParticipant on the server (server/src/types/index.ts).
export interface JoinedParticipant {
  id: string;
  roomId: string;
  userId: string | null;
  displayName: string;
  connectionStatus: "connected" | "disconnected";
  joinedAt: string;
  disconnectedAt: string | null;
}

interface JoinRoomResponse {
  message: string;
  participant: JoinedParticipant;
}

const JoinScreen = ({
  onNext,
}: {
  onNext: (participant: JoinedParticipant) => void;
}) => {
  const { activeRoutes } = useGlobalRoutesHandler();
  const roomToken = activeRoutes[activeRoutes.length - 1];

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<JoinRoomFormValues>({
    mode: "onChange",
    defaultValues: {
      displayName: "",
    },
  });

  const joinRoomParticipant = useMutation({
    mutationFn: ({
      token,
      displayName,
    }: {
      token: string;
      displayName: string;
    }) =>
      handleGlobalPostRequest<JoinRoomResponse, { displayName: string }>({
        url: `${URLS.ROOM}/${token}/join`,
        data: {
          displayName,
        },
      }),
    onError: (error) => {
      toast.error(`${error?.response?.data?.message}`)
    }
  });

  const onSubmit = (values: JoinRoomFormValues) => {
    joinRoomParticipant
      .mutateAsync({
        token: roomToken,
        displayName: values.displayName,
      })
      .then((response) => {
        onNext?.(response.participant);
      });
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[540px] flex-col items-center px-5 py-24 sm:px-10">
      <BrandMark size="text-2xl sm:text-[28px]" />

      <p className="mt-14 font-display text-xs uppercase tracking-[0.12em] text-muted">
        Joining room
      </p>

      <p className="mt-2 font-display text-4xl uppercase tracking-[0.05em] text-primary-500 sm:text-5xl">
        {roomToken}
      </p>

      <form
        className="mt-14 w-full"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <TextInput
          id="participant-name"
          label="Your name"
          placeholder="Enter your name..."
          autoComplete="name"
          registration={register("displayName", {
            required: "Please enter your name",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters",
            },
          })}
          error={errors.displayName?.message}
        />

        <button
          type="submit"
          disabled={!isValid || joinRoomParticipant.isPending}
          className="mt-5 flex h-14 w-full items-center justify-center gap-2 bg-primary-500 px-5 font-display uppercase tracking-[0.12em] text-black shadow-button transition hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span aria-hidden="true">&gt;</span>
          {joinRoomParticipant.isPending ? "Joining..." : "Join room"}
        </button>
      </form>
    </main>
  );
};

export default JoinScreen;