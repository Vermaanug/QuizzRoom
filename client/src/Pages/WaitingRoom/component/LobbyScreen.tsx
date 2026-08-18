import BrandMark from "#src/component/Brand/BrandMark";
import useGlobalRoutesHandler from "#src/services/common/useGlobalRouteHandler";
import { Users } from "lucide-react";

interface LobbyScreenProps {
  name: string;
  playerCount: number;
}

const LobbyScreen = ({ name, playerCount }: LobbyScreenProps) => {
  const { activeRoutes } = useGlobalRoutesHandler();

  const roomToken = activeRoutes[activeRoutes.length - 1];
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[540px] flex-col items-center px-5 py-24 text-center sm:px-10">
      <BrandMark size="text-2xl sm:text-[28px]" />

      <p className="mt-16 font-display text-4xl uppercase tracking-[0.05em] text-primary-500 sm:text-5xl">
        {roomToken}
      </p>

      <div
        aria-hidden="true"
        className="mt-10 flex h-20 w-20 items-center justify-center rounded-full bg-primary-500"
      >
        <span className="font-display text-2xl text-black">{initial}</span>
      </div>

      <p className="mt-5 font-display text-2xl uppercase text-ink">
        {name.trim() || "Player"}
      </p>

      <p className="mt-2 text-base text-muted">
        You&rsquo;re in! Waiting for the host to start&hellip;
      </p>

      <div
        role="status"
        className="mt-14 flex items-center gap-2 text-sm text-muted"
      >
        <Users className="h-4 w-4" aria-hidden="true" />

        <span>{playerCount} players joined</span>
      </div>
    </main>
  );
};

export default LobbyScreen;
