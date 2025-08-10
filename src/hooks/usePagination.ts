// src/hooks/usePagination.ts
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

function toInt(v: string | null, fallback: number): number {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

export function usePagination(defaultLimit = 10) {
  const [params, setParams] = useSearchParams();

  const page = toInt(params.get("page"), 1);
  const limit = toInt(params.get("limit"), defaultLimit);

  const setPage = useCallback(
    (p: number) => {
      const next = new URLSearchParams(params);
      next.set("page", String(Math.max(1, p)));
      setParams(next, { replace: true });
    },
    [params, setParams],
  );

  const setLimit = useCallback(
    (l: number) => {
      const next = new URLSearchParams(params);
      next.set("limit", String(Math.max(1, l)));
      next.set("page", "1"); // reset to first page on page-size change
      setParams(next, { replace: true });
    },
    [params, setParams],
  );

  return { page, limit, setPage, setLimit };
}
