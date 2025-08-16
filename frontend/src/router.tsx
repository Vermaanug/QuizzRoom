import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "./Pages/Auth/LoginPage";
import AuthLayout from "./Pages/Auth/AuthLayout";

// Define your routes here
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/auth/login" replace />,
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/auth/login" replace />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },
]);
