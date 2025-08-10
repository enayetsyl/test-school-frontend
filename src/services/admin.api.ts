// src/services/admin.api.ts
import { baseApi } from "./baseApi";
import type { ApiOk } from "@/types/api";
import { toPager, type PagerMeta } from "@/types/api";

export type AdminSession = {
  id: string;
  user?: { id: string; name?: string };
  status: "pending" | "active" | "submitted" | "cancelled";
  step: 1 | 2 | 3;
  videoRecordingMeta?: { chunks?: number };
};

export type ListSessionsArgs = {
  page?: number;
  limit?: number;
  q?: string;
  status?: AdminSession["status"];
  step?: 1 | 2 | 3;
};
export type ListSessionsResult = { items: AdminSession[]; meta: PagerMeta };

export type AuditLog = {
  id: string;
  actor: string;
  action: string;
  resource: string;
  message: string;
  createdAt: string;
};
export type ListAuditLogsArgs = { page?: number; limit?: number; q?: string };
export type ListAuditLogsResult = { items: AuditLog[]; meta: PagerMeta };

export type Config = {
  timePerQuestionSec: number;
  retakeLockMinutes: number;
  maxRetakes: number;
  sebMode: "enforce" | "warn" | "off";
};

export const adminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    listSessions: b.query<ListSessionsResult, ListSessionsArgs | void>({
      query: (args) => ({ url: "/admin/sessions", params: args }),
      transformResponse: (raw: ApiOk<AdminSession[]>) => ({
        items: raw.data,
        meta: toPager(raw.meta),
      }),
      providesTags: [{ type: "Sessions", id: "LIST" }],
    }),

    getSession: b.query<{ session: AdminSession }, string>({
      query: (id) => ({ url: `/admin/sessions/${id}` }),
      transformResponse: (raw: unknown) => {
        if (raw && typeof raw === "object") {
          const o = raw as Record<string, unknown>;
          const session =
            (o.data as AdminSession | undefined) ??
            (o.session as AdminSession | undefined) ??
            (raw as AdminSession);
          return { session };
        }
        return { session: raw as AdminSession };
      },
      providesTags: (_r, _e, id) => [{ type: "Sessions", id }],
    }),

    listAuditLogs: b.query<ListAuditLogsResult, ListAuditLogsArgs | void>({
      query: (args) => ({ url: "/admin/audit-logs", params: args }),
      transformResponse: (raw: ApiOk<AuditLog[]>) => ({
        items: raw.data,
        meta: toPager(raw.meta),
      }),
      providesTags: [{ type: "AuditLogs", id: "LIST" }],
    }),

    getConfig: b.query<Config, void>({
      query: () => ({ url: "/admin/config" }),
      transformResponse: (raw: ApiOk<Config>) => raw.data,
      providesTags: [{ type: "Config", id: "SINGLE" }],
    }),

    updateConfig: b.mutation<Config, Partial<Config>>({
      query: (patch) => ({
        url: "/admin/config",
        method: "PATCH",
        data: patch,
      }),
      transformResponse: (raw: ApiOk<Config>) => raw.data,
      invalidatesTags: [{ type: "Config", id: "SINGLE" }],
    }),
  }),
});

export const {
  useListSessionsQuery,
  useGetSessionQuery,
  useListAuditLogsQuery,
  useGetConfigQuery,
  useUpdateConfigMutation,
} = adminApi;
