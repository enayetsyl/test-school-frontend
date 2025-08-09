// src/utils/axios.ts
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { store } from "@/store/store";
import { setCredentials, clearAuth } from "@/store/auth.slice";
import type { AppUser } from "@/types/user";

// Add a typed custom flag to axios config (no `as any`)
declare module "axios" {
  interface AxiosRequestConfig {
    _retry?: boolean;
  }
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  withCredentials: true,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = store.getState().auth.accessToken;
  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});

let refreshing = false;
let waiters: Array<() => void> = [];

type RefreshPayload = { accessToken: string };
type RefreshResponse = { success: boolean; data: RefreshPayload };
type MeResponse = { success: boolean; data: { user: AppUser } };

api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const { response } = error;
    const original = error.config;
    if (!response || response.status !== 401 || original?._retry) {
      return Promise.reject(error);
    }

    if (refreshing) {
      await new Promise<void>((res) => waiters.push(res));
    } else {
      refreshing = true;
      try {
        const resp = await api.post<RefreshResponse>("/auth/token/refresh");
        const accessToken = resp.data?.data?.accessToken;

        if (accessToken) {
          const prev = store.getState().auth;

          if (prev.user) {
            // We already have a user; just update the token
            store.dispatch(setCredentials({ user: prev.user, accessToken }));
          } else {
            // No user in store—fetch it with the fresh token (pass header explicitly)
            try {
              const meResp = await api.get<MeResponse>("/users/me", {
                headers: { Authorization: `Bearer ${accessToken}` },
              });
              store.dispatch(
                setCredentials({ user: meResp.data.data.user, accessToken }),
              );
            } catch {
              store.dispatch(clearAuth());
            }
          }
        } else {
          store.dispatch(clearAuth());
        }
      } catch {
        store.dispatch(clearAuth());
      } finally {
        refreshing = false;
        waiters.forEach((w) => w());
        waiters = [];
      }
    }

    // retry the original request once
    if (!original) return Promise.reject(error); // <- narrow
    original._retry = true;
    return api.request(original);
  },
);
