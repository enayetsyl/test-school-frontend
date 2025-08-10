// src/services/cert.api.ts
import { toQueryError, type ApiOk, type QueryError } from "@/types/api";
import { baseApi } from "./baseApi";
import { api } from "@/utils/axios";
import { z } from "zod";

export const Levels = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export type HighestLevel = (typeof Levels)[number];

export type ICertification = {
  _id: string;
  userId: string;
  highestLevel: HighestLevel;
  issuedAt: string; // ISO
  certificateId: string;
  pdfUrl?: string | null;
  createdAt: string;
  updatedAt: string;
};

export const VerifyCertificationSchema = z.object({
  certificateId: z.string(),
  highestLevel: z.enum(Levels),
  issuedAt: z.string(),
  user: z.object({
    name: z.string(),
    email: z.email().optional(),
  }),
});
export type VerifyCertificationResult = z.infer<
  typeof VerifyCertificationSchema
>;

export const certApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    myCertification: b.query<{ certification: ICertification | null }, void>({
      query: () => ({ url: "/certifications/me" }),
      transformResponse: (raw: ApiOk<ICertification | null>) => ({
        certification: raw.data ?? null,
      }),
      providesTags: ["Certs"],
    }),

    verifyCertification: b.query<VerifyCertificationResult, string>({
      query: (certificateId) => ({
        url: `/certifications/verify/${certificateId}`,
      }),
      transformResponse: (raw: unknown): VerifyCertificationResult => {
        // Expect the envelope from baseApi, but validate strictly
        const env = z
          .object({ success: z.boolean(), data: z.unknown() })
          .safeParse(raw);
        const payload = env.success ? env.data.data : raw;
        const parsed = VerifyCertificationSchema.safeParse(payload);
        if (!parsed.success) {
          throw new Error("Invalid verification response shape");
        }
        return parsed.data;
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
