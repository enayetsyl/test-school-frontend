// src/components/layouts/AdminLayout.tsx
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="grid gap-4">
      <Outlet />
    </div>
  );
}
