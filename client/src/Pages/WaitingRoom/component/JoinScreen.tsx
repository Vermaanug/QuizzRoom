import BrandMark from "#src/component/Brand/BrandMark";
import useGlobalRoutesHandler from "#src/services/common/useGlobalRouteHandler";

interface JoinScreenProps {
  name: string;
  onNameChange: (name: string) => void;
  onJoin: () => void;
}

const JoinScreen = ({ name, onNameChange, onJoin }: JoinScreenProps) => {
  const { activeRoutes } = useGlobalRoutesHandler();

  const roomToken = activeRoutes[activeRoutes.length - 1];
  const canJoin = name.trim().length > 0;

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
        onSubmit={(event) => {
          event.preventDefault();

          if (canJoin) {
            onJoin();
          }
        }}
        noValidate
      >
        <label
          htmlFor="participant-name"
          className="mb-2 block font-display text-xs uppercase tracking-[0.12em] text-muted"
        >
          Your name
        </label>

        <input
          id="participant-name"
          name="participant-name"
          type="text"
          autoComplete="name"
          placeholder="Enter your name..."
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          aria-required="true"
          className="h-14 w-full border bg-surface px-5 text-ink outline-none placeholder:text-muted focus:border-primary-700 focus:ring-2 focus:ring-primary-700"
        />

        <button
          type="submit"
          disabled={!canJoin}
          className="mt-5 flex h-14 w-full items-center justify-center gap-2 bg-primary-500 px-5 font-display uppercase tracking-[0.12em] text-black shadow-button transition hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span aria-hidden="true">&gt;</span>
          Join room
        </button>
      </form>
    </main>
  );
};

export default JoinScreen;
