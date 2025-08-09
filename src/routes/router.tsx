// src/routes/router.tsx
import { Navigate, createBrowserRouter } from "react-router-dom";
import { PrivateRoute, RoleGuard } from "@/routes/guards";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import VerifyOtpPage from "@/features/auth/pages/VerifyOtpPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";
import { StudentDashboard } from "@/routes/pages";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/student/dashboard" replace /> },

  // Auth
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/verify-otp", element: <VerifyOtpPage /> }, // ?email=...&purpose=verify|reset
  { path: "/forgot", element: <ForgotPasswordPage /> },
  { path: "/reset", element: <ResetPasswordPage /> }, // ?email=...

  {
    element: <PrivateRoute />,
    children: [
      { path: "/student/dashboard", element: <StudentDashboard /> },
      {
        element: <RoleGuard allow={["admin"]} />,
        children: [
          { path: "/admin", element: <div className="p-6">Admin Home</div> },
        ],
      },
    ],
  },
  { path: "*", element: <div className="p-6">404</div> },
]);
