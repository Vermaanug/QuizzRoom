import PageWrapper from "#src/component/PageWrapper/PageWrapper";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <PageWrapper>
      <Outlet />
    </PageWrapper>
  );
};

export default AuthLayout;
