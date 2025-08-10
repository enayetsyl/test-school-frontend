// src/services/baseApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosError, AxiosRequestConfig } from "axios";
import { api } from "@/utils/axios";
import axios from "axios";
import type { ApiOk } from "@/types/api";
import { clearAuth, setCredentials } from "@/store/auth.slice";
import type { RootState } from "@/store/store";

type AxiosParams = {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: unknown;
  params?: unknown;
  headers?: Record<string, string>;
};

let refreshPromise: Promise<string> | null = null;

// Use a bare client for refresh so we don't send stale Authorization
const authless = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  withCredentials: true,
});

async function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = authless
      .post<ApiOk<{ accessToken: string }>>("/auth/token/refresh")
      .then((res) => res.data.data.accessToken)
      .finally(() => {
        // allow the next refresh attempt after this one settles
        setTimeout(() => (refreshPromise = null), 0);
      });
  }
  return refreshPromise;
}

const axiosBaseQuery =
  (): BaseQueryFn<AxiosParams, unknown, { status: number; data: unknown }> =>
  async (args, apiCtx) => {
    const { url, method = "GET", data, params, headers } = args;

    try {
      const res = await api({ url, method, data, params, headers });
      // return the raw envelope { success, data, meta }
      return { data: res.data };
    } catch (e) {
      const err = e as AxiosError<{ code?: string; message?: string }>;
      const status = err.response?.status ?? 500;
      const code = err.response?.data?.code;

      // Attempt one refresh on 401/UNAUTHORIZED and retry the original request
      if (status === 401 && code === "UNAUTHORIZED") {
        try {
          const token = await refreshAccessToken();

          // stash the new token in redux so the UI & subsequent calls use it
          const state = apiCtx.getState() as RootState;
          const prevUser = state.auth.user ?? null;
          if (prevUser) {
            apiCtx.dispatch(
              setCredentials({ user: prevUser, accessToken: token }),
            );
          }

          // retry the original request with updated Authorization header
          const cfg = err.config as AxiosRequestConfig;
          cfg.headers = {
            ...(cfg.headers ?? {}),
            Authorization: `Bearer ${token}`,
          };
          const retry = await api(cfg);
          return { data: retry.data };
        } catch {
          // refresh failed → clear auth and redirect to login
          apiCtx.dispatch(clearAuth());
          // hard redirect so protected routes don't flicker
          window.location.replace("/login?reason=expired");
          return {
            error: {
              status: 401,
              data: err.response?.data ?? { message: "Unauthorized" },
            },
          };
        }
      }

      return {
        error: { status, data: err.response?.data ?? { message: err.message } },
      };
    }
  };

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    "Me",
    "Users",
    "Competencies",
    "Questions",
    "Sessions",
    "Certs",
    "Config",
    "AuditLogs",
  ],
  endpoints: () => ({}),
});
