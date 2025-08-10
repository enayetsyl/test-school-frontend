// src/routes/router.tsx
import { Navigate, createBrowserRouter } from "react-router-dom";
import { PrivateRoute, RoleGuard } from "@/routes/guards";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import VerifyOtpPage from "@/features/auth/pages/VerifyOtpPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";
import { StudentDashboard } from "@/routes/pages";
import AppLayout from "@/components/layouts/AppLayout";
import PublicAuthLayout from "@/components/layouts/PublicAuthLayout";
import ExamStepPage from "@/features/exam/pages/ExamStepPage";
import ExamResultPage from "@/features/exam/pages/ExamResultPage";
import VerifyCertificationPage from "@/features/cert/pages/VerifyCertificationPage";
import MyCertificationPage from "@/features/cert/pages/MyCertificationPage";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/student/dashboard" replace /> },

  // Public auth area — shows the AuthHeader with Logo
  {
    element: <PublicAuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/verify-otp", element: <VerifyOtpPage /> },
      { path: "/forgot", element: <ForgotPasswordPage /> },
      { path: "/reset", element: <ResetPasswordPage /> },
      { path: "/certifications/verify", element: <VerifyCertificationPage /> },
    ],
  },
  // Protected area (shows Navbar)
  {
    element: <PrivateRoute />, // gate: only when logged in
    children: [
      {
        element: <AppLayout />, // layout with navbar
        children: [
          { path: "/student/dashboard", element: <StudentDashboard /> },
          // { path: "/student/exam/step/:n", element: <ExamStepPage /> },
          // { path: "/student/exam/result", element: <ExamResultPage /> },
          // Admin-only examples
          {
            element: <RoleGuard allow={["admin"]} />,
            children: [
              {
                path: "/admin",
                element: <div className="p-6">Admin Home</div>,
              },
            ],
          },
          {
            element: <RoleGuard allow={["student"]} />,
            children: [
              { path: "/student/exam/step/:n", element: <ExamStepPage /> },
              { path: "/student/exam/result", element: <ExamResultPage /> },
            ],
          },
          // student view of their certification
          {
            element: <RoleGuard allow={["student"]} />,
            children: [
              {
                path: "/student/certification",
                element: <MyCertificationPage />,
              },
            ],
          },
          // Supervisor-only placeholder (optional)
          // {
          //   element: <RoleGuard allow={["supervisor"]} />,
          //   children: [{ path: "/supervisor", element: <div className='p-6'>Supervisor Home</div> }],
          // },
        ],
      },
    ],
  },

  { path: "*", element: <div className="p-6">404</div> },
]);
