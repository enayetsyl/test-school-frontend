export type ApiMetaRaw = {
  page: number;
  limit: number;
  total: number;
};

export type PagerMeta = ApiMetaRaw & {
  pageCount: number;
};

export function toPager(meta?: ApiMetaRaw): PagerMeta {
  const page = meta?.page ?? 1;
  const limit = meta?.limit ?? 10;
  const total = meta?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / Math.max(1, limit)));
  return { page, limit, total, pageCount };
}

export type ApiOk<T> = {
  success: true;
  data: T;
  meta?: ApiMetaRaw;
  message?: string;
};
export type ApiErr = {
  success: false;
  code?: string;
  message: string;
  details?: unknown;
};

export type QueryError = {
  status: number;
  data: unknown;
};

// Narrower check for Axios-like errors (no axios import needed)
type AxiosLikeError = {
  response?: { status?: number; data?: unknown };
  message?: string;
};

// Runtime guard
function isAxiosLike(e: unknown): e is AxiosLikeError {
  return (
    typeof e === "object" &&
    e !== null &&
    "response" in (e as Record<string, unknown>)
  );
}

// Convert unknown -> QueryError (no `any`)
export function toQueryError(e: unknown): QueryError {
  if (isAxiosLike(e)) {
    const status = e.response?.status ?? 500;
    const data = e.response?.data ?? { message: e.message ?? "Request failed" };
    return { status, data };
  }
  return {
    status: 500,
    data: { message: e instanceof Error ? e.message : "Request failed" },
  };
}
