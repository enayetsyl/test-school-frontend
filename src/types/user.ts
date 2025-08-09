// src/types/user.ts
export type Role = "admin" | "student" | "supervisor";

// Shape returned by backend (name can be missing/null)
export type ApiUser = {
  id: string;
  email: string;
  role: Role;
  name?: string | null;
};

// Shape we keep in Redux (name always present)
export type AppUser = {
  id: string;
  email: string;
  role: Role;
  name: string;
};

export function toAppUser(u: ApiUser): AppUser {
  return {
    id: u.id,
    email: u.email,
    role: u.role,
    // fallback if name is missing/empty → use email's local-part
    name: (u.name ?? "").trim() || u.email.split("@")[0],
  };
}
