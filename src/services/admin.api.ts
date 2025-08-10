// src/services/admin.api.ts
import { baseApi } from "./baseApi";
import type { PageMeta } from "@/types/api";
import { normalizeList } from "@/types/api";

export type AdminSession = {
  id: string;
  user: { id: string; name: string };
  status: "pending" | "active" | "submitted" | "cancelled";
  step: 1 | 2 | 3;
  videoRecordingMeta?: { chunks?: number };
};

export type AuditLog = {
  id: string;
  actor: string;
  action: string;
  resource: string;
  message: string;
  createdAt: string;
};

export type SystemConfig = {
  timePerQuestionSec: number;
  retakeLockMinutes: number;
  maxRetakes: number;
  sebMode: "enforce" | "warn" | "off";
};

export const adminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    listSessions: b.query<
      { items: AdminSession[]; meta?: PageMeta },
      {
        page?: number;
        limit?: number;
        q?: string;
        status?: "pending" | "active" | "submitted" | "cancelled";
        step?: 1 | 2 | 3;
        userId?: string;
        from?: string;
        to?: string;
      } | void
    >({
      query: (params) => ({ url: "/admin/sessions", params }),
      transformResponse: (raw: unknown) => normalizeList<AdminSession>(raw),
      providesTags: ["Sessions"],
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

    listAuditLogs: b.query<
      { items: AuditLog[]; meta?: PageMeta },
      {
        page?: number;
        limit?: number;
        actorId?: string;
        action?: string;
        resource?: string;
        from?: string;
        to?: string;
        q?: string;
      } | void
    >({
      query: (params) => ({ url: "/admin/audit-logs", params }),
      transformResponse: (raw: unknown) => normalizeList<AuditLog>(raw),
    }),

    getConfig: b.query<SystemConfig, void>({
      query: () => ({ url: "/admin/config" }),
      providesTags: ["Config"],
    }),

    updateConfig: b.mutation<SystemConfig, Partial<SystemConfig>>({
      query: (patch) => ({
        url: "/admin/config",
        method: "PATCH",
        data: patch,
      }),
      invalidatesTags: ["Config"],
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
