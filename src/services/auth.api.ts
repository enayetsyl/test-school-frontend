// src/services/auth.api.ts
import { baseApi } from "./baseApi";
import { setCredentials, clearAuth } from "@/store/auth.slice";
import type { ApiUser } from "@/types/user";
import { toAppUser } from "@/types/user";

type LoginBody = { email: string; password: string };
type LoginResult = { user: ApiUser; accessToken: string };
type MeResult = { user: ApiUser };

export const authApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    login: b.mutation<LoginResult, LoginBody>({
      query: (body) => ({ url: "/auth/login", method: "POST", data: body }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({
              user: toAppUser(data.user),
              accessToken: data.accessToken,
            }),
          );
        } catch {
          /* ignore */
        }
      },
    }),

    me: b.query<MeResult, void>({
      query: () => ({ url: "/users/me" }),
      providesTags: ["Me"],
    }),

    logout: b.mutation<void, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(clearAuth());
        }
      },
    }),
  }),
});

export const { useLoginMutation, useMeQuery, useLogoutMutation } = authApi;
