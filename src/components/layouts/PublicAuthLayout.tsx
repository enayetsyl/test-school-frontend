// src/components/layouts/PublicAuthLayout.tsx
import { Outlet } from "react-router-dom";
import AuthHeader from "./AuthHeader";

export default function PublicAuthLayout() {
  return (
    <div className="min-h-dvh flex flex-col">
      <AuthHeader />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-md px-4 py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
