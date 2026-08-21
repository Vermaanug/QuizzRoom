import { Navigate, Outlet } from "react-router-dom";
import useCurrentUser from "#src/services/user/useCurrentUser";

const PublicRoute = () => {
  const {
    service: { getCurrentUserService },
  } = useCurrentUser();

  if (getCurrentUserService.isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600" />
          <p className="mt-4 text-sm font-medium text-muted">
            Checking your session…
          </p>
        </div>
      </div>
    );
  }

  if (getCurrentUserService.data?.user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;