// src/services/user.api.ts
import { baseApi } from "./baseApi";
import type { PageMeta } from "@/types/api";
import { normalizeList } from "@/types/api";

export type Role = "admin" | "student" | "supervisor";
export type UserStatus = "active" | "inactive";

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status?: UserStatus;
  createdAt?: string;
  updatedAt?: string;
};

export const userApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    adminListUsers: b.query<
      { items: PublicUser[]; meta?: PageMeta },
      {
        page?: number;
        limit?: number;
        q?: string;
        role?: Role;
        status?: UserStatus;
      } | void
    >({
      query: (params) => ({ url: "/admin/users", params }),
      transformResponse: (raw: unknown) => normalizeList<PublicUser>(raw),
      providesTags: ["Users"],
    }),

    adminGetUser: b.query<PublicUser, string>({
      query: (id) => ({ url: `/admin/users/${id}` }),
      transformResponse: (raw: unknown) => {
        if (raw && typeof raw === "object") {
          const o = raw as Record<string, unknown>;
          return (
            (o.data as PublicUser | undefined) ??
            (o.user as PublicUser | undefined) ??
            (raw as PublicUser)
          );
        }
        return raw as PublicUser;
      },
      providesTags: (_r, _e, id) => [{ type: "Users", id }],
    }),

    adminCreateUser: b.mutation<
      PublicUser,
      { name: string; email: string; role: Role; password: string }
    >({
      query: (body) => ({ url: "/admin/users", method: "POST", data: body }),
      invalidatesTags: ["Users"],
    }),

    adminUpdateUser: b.mutation<
      PublicUser,
      {
        id: string;
        patch: Partial<Pick<PublicUser, "name" | "role" | "status">> & {
          password?: string;
        };
      }
    >({
      query: ({ id, patch }) => ({
        url: `/admin/users/${id}`,
        method: "PATCH",
        data: patch,
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useAdminListUsersQuery,
  useAdminGetUserQuery,
  useAdminCreateUserMutation,
  useAdminUpdateUserMutation,
} = userApi;
