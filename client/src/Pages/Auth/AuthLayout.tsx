import { Link, Outlet } from "react-router-dom";

const AuthLayout = () => (
  <div className="flex min-h-screen items-start justify-center bg-canvas px-5 py-12 sm:py-16">
    <main className="w-full max-w-[540px]">
      <Link aria-label="Quiz Room home" className="mb-9 inline-flex items-center gap-1 font-display text-xl uppercase tracking-[-0.03em] text-ink sm:text-[23px]" to="/">
        <span className="text-primary-500">QUIZ</span> ROOM <b aria-hidden="true" className="ml-1 text-2xl not-italic text-primary-500">ϟ</b>
      </Link>
      <Outlet />
    </main>
  </div>
);

export default AuthLayout;
