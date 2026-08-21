import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "./Pages/Auth/LoginPage";
import AuthLayout from "./Pages/Auth/AuthLayout";
import SignupPage from "./Pages/Auth/SignupPage";
import ForgotPasswordPage from "./Pages/Auth/ForgotPasswordPage";
import HomePage from "./Pages/Home/HomePage";
import ProtectedRoute from "./component/ProtectedRoute/ProtectedRoute";
import DashboardPage from "./Pages/Dashboard/DashboardPage";
import QuizEditorPage from "./Pages/QuizEditor/QuizEditorPage";
import HostWaitingRoomPage from "./Pages/WaitingRoom/HostWaitingRoomPage";
import ParticipantRoomPage from "./Pages/WaitingRoom/ParticipantRoomPage"
import HostLiveRoomPage from "./Pages/HostLiveRoom/HostLiveRoomPage"
import PublicRoute from "./component/ProtectedRoute/PublicRoute";

// Define your routes here
export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/",
        element: <HomePage />,
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
          {
            path: "signup",
            element: <SignupPage />,
          },
          {
            path: "forgot-password",
            element: <ForgotPasswordPage />,
          },
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "quiz/:quizId",
        element: <QuizEditorPage />,
      },
      {
        path: "room/:roomToken",
        element: <HostWaitingRoomPage />,
      },
      {
        path: "room/:roomToken/quiz",
        element: <HostLiveRoomPage />,
      },
    ],
  },

  {
    path: "join/:roomToken",
    element: <ParticipantRoomPage />,
  },

  {
    path: "/home",
    element: <Navigate to="/dashboard" replace />,
  },
]);
