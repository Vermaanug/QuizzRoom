import { Link, Outlet } from "react-router-dom";

const AuthLayout = () => (
  <div className="auth-page">
    <main className="auth-shell">
      <Link aria-label="Quiz Room home" className="brand mb-9 inline-flex" to="/">
        <span>QUIZ</span> ROOM <b aria-hidden="true">ϟ</b>
      </Link>
      <Outlet />
    </main>
  </div>
);

export default AuthLayout;
