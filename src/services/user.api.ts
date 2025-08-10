// src/services/user.api.ts
import { baseApi } from "./baseApi";
import type { ApiOk } from "@/types/api";
import { toPager, type PagerMeta } from "@/types/api";
export type Role = "admin" | "student" | "supervisor";
export type UserStatus = "active" | "disabled";

export type PublicUser = {
  _id: string;
  name: string;
  email: string;
  role: Role;
  status?: UserStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminListUsersArgs = {
  page?: number;
  limit?: number;
  q?: string;
  role?: PublicUser["role"];
  status?: PublicUser["status"];
};

export type AdminListUsersResult = { items: PublicUser[]; meta: PagerMeta };

export const userApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    adminListUsers: b.query<AdminListUsersResult, AdminListUsersArgs | void>({
      query: (params) => ({ url: "/admin/users", params }),
      transformResponse: (raw: ApiOk<PublicUser[]>) => ({
        items: raw.data,
        meta: toPager(raw.meta),
      }),
      providesTags: [{ type: "Users", id: "LIST" }],
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
      {
        name: string;
        email: string;
        role: PublicUser["role"];
        password: string;
      }
    >({
      query: (body) => ({ url: "/admin/users", method: "POST", data: body }),
      transformResponse: (raw: ApiOk<PublicUser>) => raw.data,
      invalidatesTags: [{ type: "Users", id: "LIST" }],
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
      transformResponse: (raw: ApiOk<PublicUser>) => raw.data,
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
  }),
});

export const {
  useAdminListUsersQuery,
  useAdminGetUserQuery,
  useAdminCreateUserMutation,
  useAdminUpdateUserMutation,
} = userApi;
