// src/routes/guards.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

export function PrivateRoute() {
  const user = useSelector((s: RootState) => s.auth.user);
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export function RoleGuard({
  allow,
}: {
  allow: Array<"admin" | "student" | "supervisor">;
}) {
  const role = useSelector((s: RootState) => s.auth.user?.role);
  return role && allow.includes(role) ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
}
