import PageWrapper from "#src/component/PageWrapper/PageWrapper";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <PageWrapper className="relative flex items-center justify-center overflow-hidden bg-canvas px-4 py-10 sm:px-6">
      <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary-100/70 blur-3xl" />
      <div className="absolute -bottom-48 -right-32 h-[28rem] w-[28rem] rounded-full bg-violet-100/70 blur-3xl" />
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-7 flex items-center justify-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-600 text-xl font-extrabold text-white shadow-button">
            Q
          </div>
          <span className="font-display text-2xl font-extrabold tracking-tight text-ink">
            Quizz<span className="text-primary-600">Room</span>
          </span>
        </div>
        <main className="rounded-3xl border border-white/80 bg-surface/95 p-6 shadow-card backdrop-blur sm:p-9">
          <Outlet />
        </main>
        <p className="mt-6 text-center text-xs text-muted">
          Learn, compete, and grow together.
        </p>
      </div>
    </PageWrapper>
  );
};

export default AuthLayout;
