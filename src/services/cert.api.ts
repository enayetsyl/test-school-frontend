// src/services/cert.api.ts
import { baseApi } from "./baseApi";
import type { QueryError } from "@/types/api";
import { toQueryError } from "@/types/api";
import { api } from "@/utils/axios";
import { z } from "zod";

export const Levels = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export type HighestLevel = (typeof Levels)[number];

export type ICertification = {
  _id: string;
  userId: string;
  highestLevel: HighestLevel;
  issuedAt: string;
  certificateId: string;
  pdfUrl?: string | null;
  createdAt: string;
  updatedAt: string;
};

const VerifyPayloadSchema = z.object({
  certificateId: z.string(),
  highestLevel: z.enum(Levels),
  issuedAt: z.string(),
  user: z.object({
    name: z.string(),
    email: z.string().email().optional(),
  }),
});
export type VerifyCertificationResult = z.infer<typeof VerifyPayloadSchema>;
const VerifyEnvelopeSchema = z.object({ data: VerifyPayloadSchema });

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

    verifyCertification: b.query<VerifyCertificationResult, string>({
      query: (certificateId) => ({
        url: `/certifications/verify/${certificateId}`,
      }),
      transformResponse: (raw: unknown): VerifyCertificationResult => {
        // baseApi usually unwraps to inner "data", but support both shapes safely
        const direct = VerifyPayloadSchema.safeParse(raw);
        if (direct.success) return direct.data;

        const env = VerifyEnvelopeSchema.safeParse(raw);
        if (env.success) return env.data.data;

        // Treat unknown shapes as an error -> hook goes into isError state
        throw new Error("Invalid verification response shape");
      },
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
  useLazyVerifyCertificationQuery,
  useLazyGetCertificationPdfQuery,
} = certApi;
