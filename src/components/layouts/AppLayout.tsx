// src/components/layouts/AppLayout.tsx
import { Outlet } from "react-router-dom";
import AppNavbar from "./AppNavbar";

export default function AppLayout() {
  return (
    <div className="min-h-dvh flex flex-col">
      <AppNavbar />
      <main className="container mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
