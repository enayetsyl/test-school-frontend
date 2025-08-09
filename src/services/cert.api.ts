// src/services/cert.api.ts
import { baseApi } from "./baseApi";
import type { QueryError } from "@/types/api";
import { toQueryError } from "@/types/api";
import { api } from "@/utils/axios";

export type ICertification = {
  _id: string;
  userId: string;
  highestLevel: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  issuedAt: string;
  certificateId: string;
  pdfUrl?: string | null;
  createdAt: string;
  updatedAt: string;
};

export const certApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    myCertification: b.query<{ certification: ICertification | null }, void>({
      query: () => ({ url: "/certifications/me" }),
      transformResponse: (raw: unknown) => {
        if (raw && typeof raw === "object") {
          const o = raw as Record<string, unknown>;
          const certification =
            (o.data as ICertification | null | undefined) ??
            (o.certification as ICertification | null | undefined) ??
            (raw as ICertification | null);
          return { certification };
        }
        return { certification: raw as ICertification | null };
      },
      providesTags: ["Certs"],
    }),

    verifyCertification: b.query<
      {
        valid: boolean;
        holderName?: string;
        level?: string;
        issuedAt?: string;
      },
      string
    >({
      query: (certificateId) => ({
        url: `/certifications/verify/${certificateId}`,
      }),
    }),

    getCertificationPdf: b.query<Blob, string>({
      async queryFn(id): Promise<{ data: Blob } | { error: QueryError }> {
        try {
          const res = await api.get(`/certifications/${id}/pdf`, {
            responseType: "blob",
          });
          return { data: res.data as Blob };
        } catch (e: unknown) {
          return { error: toQueryError(e) };
        }
      },
      providesTags: ["Certs"],
    }),
  }),
});

export const {
  useMyCertificationQuery,
  useVerifyCertificationQuery,
  useGetCertificationPdfQuery,
} = certApi;
