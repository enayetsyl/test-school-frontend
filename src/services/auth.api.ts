import { baseApi } from "./baseApi";
import { setCredentials, clearAuth } from "@/store/auth.slice";
import type { RootState } from "@/store/store";
import type { AppUser } from "@/types/user";

export type RegisterBody = { name: string; email: string; password: string };
export type RegisterResult = { user: AppUser };

export type LoginBody = { email: string; password: string };
export type LoginResult = { user: AppUser; accessToken: string };

export type MeResult = { user: AppUser };

export type OtpPurpose = "verify" | "reset";
export type OtpSendBody = { email: string; purpose: OtpPurpose };
export type OtpVerifyBody = { email: string; otp: string; purpose: OtpPurpose };
export type OtpOk = { ok: boolean };

export type ForgotBody = { email: string };
export type ResetBody = { email: string; otp: string; newPassword: string };

export const authApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    // Login → sets credentials + invalidates /me so dependent screens auto-refresh
    login: b.mutation<LoginResult, LoginBody>({
      query: (body) => ({ url: "/auth/login", method: "POST", data: body }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({ user: data.user, accessToken: data.accessToken }),
          );
        } catch {
          /* handled in UI */
        }
      },
      invalidatesTags: ["Me"],
    }),

    // Register → backend returns { user } (no token)
    register: b.mutation<RegisterResult, RegisterBody>({
      query: (body) => ({ url: "/auth/register", method: "POST", data: body }),
      invalidatesTags: ["Me"],
    }),

    // Optional: manual refresh if you need it in a UI action
    refresh: b.mutation<{ accessToken: string }, void>({
      query: () => ({ url: "/auth/token/refresh", method: "POST" }),
      async onQueryStarted(_, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;
          const prev = (getState() as RootState).auth;
          if (prev?.user)
            dispatch(
              setCredentials({
                user: prev.user,
                accessToken: data.accessToken,
              }),
            );
        } catch {
          /* interceptor/route guards will handle */
        }
      },
    }),

    // OTP
    sendOtp: b.mutation<OtpOk, OtpSendBody>({
      query: (body) => ({ url: "/auth/otp/send", method: "POST", data: body }),
    }),
    verifyOtp: b.mutation<OtpOk, OtpVerifyBody>({
      query: (body) => ({
        url: "/auth/otp/verify",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Me"],
    }),
    resendOtp: b.mutation<OtpOk, OtpSendBody>({
      query: (body) => ({
        url: "/auth/otp/resend",
        method: "POST",
        data: body,
      }),
    }),

    // Forgot/Reset
    forgot: b.mutation<OtpOk, ForgotBody>({
      query: (body) => ({ url: "/auth/forgot", method: "POST", data: body }),
    }),
    reset: b.mutation<OtpOk, ResetBody>({
      query: (body) => ({ url: "/auth/reset", method: "POST", data: body }),
    }),

    // Me / Logout
    me: b.query<MeResult, void>({
      query: () => ({ url: "/users/me" }),
      providesTags: ["Me"],
      // NOTE: This assumes baseApi unwraps to the payload under `data`.
      // If your baseApi returns the full envelope, add: transformResponse: (r: any) => r.data
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
      invalidatesTags: ["Me"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshMutation, // optional
  useSendOtpMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useForgotMutation,
  useResetMutation,
  useMeQuery,
  useLogoutMutation,
} = authApi;
