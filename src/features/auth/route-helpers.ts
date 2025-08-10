// src/features/auth/route-helpers.ts
import type { Role } from "@/types/user";

export function defaultRouteForRole(role: Role): string {
  if (role === "admin") return "/admin";
  if (role === "supervisor") return "/supervisor";
  return "/student/dashboard";
}
