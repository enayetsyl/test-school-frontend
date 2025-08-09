// src/services/baseApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import { api } from "@/utils/axios";

type QueryArgs = {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: unknown;
  params?: unknown;
  headers?: Record<string, string>;
};

export type BaseQueryError = {
  status: number;
  data: unknown;
};

const axiosBaseQuery =
  (): BaseQueryFn<QueryArgs, unknown, BaseQueryError> =>
  async ({ url, method = "GET", data, params, headers }) => {
    try {
      const res = await api({ url, method, data, params, headers });
      // backend wraps success in { success, data }
      return { data: (res.data as { data?: unknown })?.data ?? res.data };
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const status = e.response?.status ?? 500;
        const respData = e.response?.data ?? { message: e.message };
        return { error: { status, data: respData } };
      }
      const message = e instanceof Error ? e.message : "Unknown error";
      return { error: { status: 500, data: { message } } };
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
  ],
  endpoints: () => ({}),
});
