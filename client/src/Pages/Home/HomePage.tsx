import useGlobalRoutesHandler from "#src/services/common/useGlobalRouteHandler";
import { getRoomQueryOptions } from "#src/services/room/useGetRoomService";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useCurrentUser from "#src/services/user/useCurrentUser";

const stats = [
  ["148K+", "Rooms hosted"],
  ["9.2M+", "Questions answered"],
  ["24K", "Active players"],
];

const Logo = () => (
  <Link
    aria-label="Quiz Room home"
    className="inline-flex items-center gap-1 font-display text-xl uppercase tracking-[-0.03em] text-ink sm:text-[23px]"
    to="/"
  >
    <span className="text-primary-500">QUIZ</span> ROOM{" "}
    <b aria-hidden="true" className="ml-1 text-2xl not-italic text-primary-500">
      ϟ
    </b>
  </Link>
);

const extractRoomToken = (input: string): string => {
  const segments = input.trim().split("/").filter(Boolean);
  return segments[segments.length - 1] ?? input.trim();
};

type JoinRoomFormValues = {
  roomCode: string;
};

const HomePage = () => {
  const { navigateTo } = useGlobalRoutesHandler();
  const queryClient = useQueryClient();
  const [isCheckingRoom, setIsCheckingRoom] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JoinRoomFormValues>();

  const onJoinRoomSubmit = handleSubmit(async (values) => {
    const roomToken = extractRoomToken(values.roomCode);

    setIsCheckingRoom(true);
    try {
      const data = await queryClient.fetchQuery(getRoomQueryOptions(roomToken));
      if (data.room.status !== "waiting") {
        toast.error("This room has already started or ended.");
        return;
      }

      navigateTo({
        url: `/join/${data.room.inviteToken}`,
      });
    } catch {
      toast.error("We couldn't find a room with that code.");
    } finally {
      setIsCheckingRoom(false);
    }
  });

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="flex h-[82px] items-center justify-between border-b px-5 sm:px-10">
        <Logo />
        <nav
          className="flex items-center gap-5 sm:gap-10"
          aria-label="Account navigation"
        >
          <Link
            className="font-display text-base uppercase tracking-[0.12em] text-muted transition hover:text-ink"
            to="/auth/login"
          >
            Log in
          </Link>
          <Link
            className="inline-flex h-12 items-center justify-center gap-3 bg-primary-500 px-6 font-display uppercase tracking-[0.1em] text-black shadow-button transition hover:bg-primary-100 sm:h-14 sm:px-9"
            to="/auth/signup"
          >
            Sign up
          </Link>
        </nav>
      </header>

      <main>
        <section className="mx-auto flex min-h-[640px] max-w-3xl flex-col items-center px-5 pb-14 pt-[50px] text-center sm:pt-16">
          <div className="inline-flex items-center gap-2 border border-primary-700 bg-primary-500/10 px-5 py-2 font-display text-sm uppercase tracking-[0.09em] text-primary-500">
            <span aria-hidden="true">◉</span> Live quiz platform
          </div>
          <h1 className="mt-10 flex flex-col font-display text-[70px] uppercase leading-[0.91] tracking-[-0.025em] sm:text-[100px]">
            <span>Host.</span>
            <span className="text-primary-500">Play.</span>
            <span>Win.</span>
          </h1>
          <p className="mt-7 text-base leading-7 text-muted sm:text-lg">
            Create trivia rooms in seconds. Share a link. Watch
            <br className="hidden sm:block" /> your friends battle it out in
            real time.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              className="inline-flex h-14 items-center justify-center gap-3 bg-primary-500 px-7 font-display text-sm uppercase tracking-[0.1em] text-black shadow-button transition hover:bg-primary-100"
              to="/auth/signup"
            >
              <span className="text-xl font-light">＋</span> Start hosting free
            </Link>
            <Link
              className="inline-flex h-14 items-center justify-center gap-3 border px-7 font-display text-sm uppercase tracking-[0.1em] text-ink transition hover:border-muted"
              to="/auth/login"
            >
              <span aria-hidden="true">▷</span> Log in
            </Link>
          </div>

          <form
            className="mt-14 w-full max-w-[580px] border bg-[#171717] p-5 text-left"
            onSubmit={onJoinRoomSubmit}
            noValidate
          >
            <label
              className="font-display uppercase tracking-[0.12em] text-muted"
              htmlFor="room-code"
            >
              Have an invite link?
            </label>
            <div className="mt-4 flex gap-3">
              <input
                className="h-12 min-w-0 flex-1 border bg-[#202020] px-4 text-sm text-ink outline-none placeholder:text-muted focus:border-primary-700"
                id="room-code"
                placeholder="Paste room code or link..."
                autoComplete="off"
                aria-invalid={Boolean(errors.roomCode)}
                aria-describedby={
                  errors.roomCode ? "room-code-error" : undefined
                }
                {...register("roomCode", {
                  required: "Enter a room code or invite link",
                  validate: (value) =>
                    value.trim().length > 0 ||
                    "Enter a room code or invite link",
                })}
              />
              <button
                aria-label="Join room"
                className="flex w-16 shrink-0 items-center justify-center bg-primary-700 text-2xl text-black transition hover:bg-primary-500 disabled:cursor-not-allowed disabled:opacity-60"
                type="submit"
                disabled={isCheckingRoom}
              >
                ›
              </button>
            </div>
            {errors.roomCode && (
              <p
                id="room-code-error"
                role="alert"
                className="mt-2 text-xs font-medium text-danger"
              >
                {errors.roomCode.message}
              </p>
            )}
          </form>
        </section>

        <section
          className="grid border-y md:grid-cols-3"
          aria-label="Quiz Room statistics"
        >
          {stats.map(([value, label]) => (
            <div
              className="flex min-h-28 flex-col items-center justify-center border-b last:border-0 md:border-b-0 md:border-r"
              key={label}
            >
              <strong className="font-display text-4xl text-primary-500">
                {value}
              </strong>
              <span className="mt-1 text-sm text-muted">{label}</span>
            </div>
          ))}
        </section>
      </main>
      <button
        aria-label="Help"
        className="fixed bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full bg-ink text-2xl text-black shadow-lg"
      >
        ?
      </button>
    </div>
  );
};

export default HomePage;
