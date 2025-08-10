// src/types/api.ts

export type PageMeta = {
  page: number;
  limit: number;
  total: number;
  pageCount: number;
};

export type QueryError = { status: number; data: unknown };

/** Some endpoints return { items, meta }, others { data, meta }, others a bare array. */
export function normalizeList<T>(raw: unknown): {
  items: T[];
  meta?: PageMeta;
} {
  if (Array.isArray(raw)) return { items: raw };

  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    const fromItems = Array.isArray(obj.items) ? (obj.items as T[]) : undefined;
    const fromData = Array.isArray(obj.data) ? (obj.data as T[]) : undefined;
    const meta = (obj.meta as PageMeta | undefined) ?? undefined;

    if (fromItems) return { items: fromItems, meta };
    if (fromData) return { items: fromData, meta };
  }
  return { items: [] };
}

/** Turn unknown error (Axios, fetch, thrown string) into RTK-friendly error. */
export function toQueryError(e: unknown): QueryError {
  type MaybeAxiosErr = { response?: { status?: number; data?: unknown } };
  const m = e as MaybeAxiosErr;

  const status =
    typeof m?.response?.status === "number" ? m.response!.status : 500;

  const data =
    m?.response?.data ??
    (e instanceof Error ? e.message : (e ?? "Unknown error"));

  return { status, data };
}
