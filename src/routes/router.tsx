// src/routes/router.tsx
import { Navigate, createBrowserRouter } from "react-router-dom";
import { PrivateRoute, RoleGuard } from "@/routes/guards";
import { LoginPage, StudentDashboard } from "@/routes/pages";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/student/dashboard" replace /> },
  { path: "/login", element: <LoginPage /> },
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
