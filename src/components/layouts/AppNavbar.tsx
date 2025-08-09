// src/components/layouts/AppNavbar.tsx
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import { useLogoutMutation } from "@/services/auth.api";
import Logo from "../common/Logo";

function linkCls({ isActive }: { isActive: boolean }) {
  return [
    "px-3 py-2 rounded-md text-sm font-medium transition",
    isActive
      ? "bg-accent text-accent-foreground"
      : "text-muted-foreground hover:text-foreground hover:bg-accent",
  ].join(" ");
}

export default function AppNavbar() {
  const user = useSelector((s: RootState) => s.auth.user);
  const role = user?.role;
  const navigate = useNavigate();
  const [logout, { isLoading }] = useLogoutMutation();

  const links = [
    { to: "/student/dashboard", label: "Dashboard", show: true },
    { to: "/admin", label: "Admin", show: role === "admin" },
    { to: "/supervisor", label: "Supervisor", show: role === "supervisor" },
  ].filter((l) => l.show);

  const onLogout = async () => {
    try {
      await logout().unwrap(); // clears Redux auth in onQueryStarted
      navigate("/login", { replace: true }); // send to login after server logout
    } catch {
      // already handled by service/axios toasts if any
      navigate("/login", { replace: true }); // hard-redirect anyway to be safe
    }
  };

  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
        <Logo className="shrink-0" withText={false} />
        {/* <div className="font-semibold">Test_School</div> */}

        <nav className="flex-1">
          <ul className="flex items-center gap-1">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} className={linkCls}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {user.name} • {user.role}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={onLogout}
              disabled={isLoading}
              aria-label="Log out"
            >
              <LogOutIcon className="mr-1" />
              {isLoading ? "Logging out..." : "Logout"}
            </Button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
