// src/components/layouts/AppNavbar.tsx
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { LogOutIcon, MenuIcon, UserIcon } from "lucide-react";
import { useLogoutMutation } from "@/services/auth.api";
import Logo from "../common/Logo";
import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function linkCls({ isActive }: { isActive: boolean }) {
  return cx(
    "px-3 py-2 rounded-md text-sm font-medium transition",
    isActive
      ? "bg-accent text-accent-foreground"
      : "text-muted-foreground hover:text-foreground hover:bg-accent",
  );
}

export default function AppNavbar() {
  const user = useSelector((s: RootState) => s.auth.user);
  const role = user?.role;
  const navigate = useNavigate();
  const location = useLocation();
  const [logout, { isLoading }] = useLogoutMutation();
  const inAdmin = location.pathname.startsWith("/admin");
  const isAdmin = role === "admin";

  const links = [
    { to: "/student/dashboard", label: "Dashboard", show: role === "student" },
    { to: "/student/exam/step/:n", label: "Exam", show: role === "student" },
    { to: "/student/exam/result", label: "Result", show: role === "student" },
    {
      to: "/student/certification",
      label: "Certificate",
      show: role === "student",
    },
    { to: "/admin/users", label: "Admin", show: isAdmin && !inAdmin },
    { to: "/supervisor", label: "Supervisor", show: role === "supervisor" },
  ].filter((l) => l.show);

  const adminLinks = [
    { to: "/admin/users", label: "Users" },
    { to: "/admin/competencies", label: "Competencies" },
    { to: "/admin/questions", label: "Questions" },
    { to: "/admin/sessions", label: "Sessions" },
    { to: "/admin/audit-logs", label: "Audit Logs" },
    { to: "/admin/config", label: "Config" },
  ];

  const onLogout = async () => {
    try {
      await logout().unwrap();
      navigate("/login", { replace: true });
    } catch {
      navigate("/login", { replace: true });
    }
  };

  const [open, setOpen] = React.useState(false);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="mx-auto max-w-6xl px-3 sm:px-4">
        {/* Top row */}
        <div className="flex h-14 items-center gap-2">
          {/* Left: hamburger (mobile) + logo (desktop only) */}
          <div className="flex items-center gap-2">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open menu"
                >
                  <MenuIcon className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="left"
                className="w-[86%] max-w-sm p-0 flex flex-col"
              >
                <SheetHeader className="px-4 py-3 text-left">
                  <SheetTitle className="flex items-center gap-2">
                    <Logo className="h-6 w-8 shrink-0" withText={false} />
                    <span className="text-base font-semibold">Test School</span>
                  </SheetTitle>
                </SheetHeader>

                {/* Mobile nav links */}
                <nav className="px-2 pb-4 flex-1 overflow-y-auto">
                  <div className="px-2 py-1 text-xs font-semibold uppercase text-muted-foreground">
                    Navigation
                  </div>
                  <ul className="space-y-1 px-1">
                    {links.map((l) => (
                      <li key={l.to}>
                        <NavLink
                          to={l.to}
                          className={({ isActive }) =>
                            cx(
                              "block rounded-md px-3 py-2 text-sm",
                              isActive
                                ? "bg-accent text-accent-foreground"
                                : "text-foreground/80 hover:bg-accent",
                            )
                          }
                          onClick={close}
                        >
                          {l.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>

                  {isAdmin && inAdmin && (
                    <>
                      <div className="mt-4 px-2 py-1 text-xs font-semibold uppercase text-muted-foreground">
                        Admin
                      </div>
                      <ul className="space-y-1 px-1">
                        {adminLinks.map((l) => (
                          <li key={l.to}>
                            <NavLink
                              to={l.to}
                              className={({ isActive }) =>
                                cx(
                                  "block rounded-md px-3 py-2 text-sm",
                                  isActive
                                    ? "bg-accent text-accent-foreground"
                                    : "text-foreground/80 hover:bg-accent",
                                )
                              }
                              onClick={close}
                            >
                              {l.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </nav>

                {/* Bottom user block */}
                {user && (
                  <div className="border-t px-3 py-4 flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <UserIcon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="truncate font-medium">{user.name}</div>
                      <div className="truncate text-xs text-muted-foreground capitalize">
                        {user.role}
                      </div>
                    </div>
                  </div>
                )}
              </SheetContent>
            </Sheet>

            {/* Logo only on md+ (hidden on mobile to keep just burger+logout) */}
            <div className="hidden md:block">
              <Logo className="shrink-0" withText={false} />
            </div>
          </div>

          {/* Center: desktop nav */}
          <nav className="hidden flex-1 md:block">
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

          {/* Right: actions */}
          {user ? (
            <>
              {/* Desktop: name + logout (unchanged) */}
              <div className="ml-auto hidden items-center gap-2 sm:gap-3 md:flex">
                <span className="text-sm text-muted-foreground">
                  {user.name} • <span className="capitalize">{user.role}</span>
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onLogout}
                  disabled={isLoading}
                  aria-label="Log out"
                  className="gap-1"
                >
                  <LogOutIcon className="h-4 w-4 sm:mr-1" />
                  <span>{isLoading ? "Logging out..." : "Logout"}</span>
                </Button>
              </div>

              {/* Mobile: ONLY a logout icon — hidden while sheet is open */}
              {!open && (
                <div className="ml-auto md:hidden">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={onLogout}
                    disabled={isLoading}
                    aria-label="Log out"
                  >
                    <LogOutIcon className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Admin subnav (desktop + tablet) */}
        {isAdmin && inAdmin ? (
          <nav
            aria-label="Admin section"
            className="hidden h-12 items-center md:flex pb-3"
          >
            <ul className="flex w-full gap-1">
              {adminLinks.map((l) => (
                <li key={l.to}>
                  <NavLink to={l.to} className={linkCls}>
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
