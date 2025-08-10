// src/features/auth/route-helpers.ts
import type { Role } from "@/types/user";

export function defaultRouteForRole(role: Role): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "supervisor":
      return "/supervisor";
    case "student":
    default:
      return "/dashboard";
  }
}
