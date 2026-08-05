import { Navigate, Outlet, useLocation } from "react-router-dom";
import useCurrentUser from "#src/hooks/useCurrentUser";

const ProtectedRoute = () => {
  const location = useLocation();
  const { data, isLoading, isError } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600" />
          <p className="mt-4 text-sm font-medium text-muted">Checking your session…</p>
        </div>
      </div>
    );
  }

  if (isError || !data?.user) {
    return <Navigate replace state={{ from: location.pathname }} to="/auth/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
