// src/services/exam.api.ts
import type { ApiOk } from "@/types/api";
import { baseApi } from "./baseApi";

export type StartExamBody = {
  step: 1 | 2 | 3;
  screen?: { width: number; height: number };
};
export type StartExamResult = {
  sessionId: string;
  deadlineAt: string;
  totalQuestions: number;
  timePerQuestionSec: number;
};

export type AnswerBody = {
  sessionId: string;
  questionId: string;
  selectedIndex: number;
  elapsedMs: number;
};
export type SubmitBody = { sessionId: string };
export type StatusResult = {
  session: {
    id: string;
    step: 1 | 2 | 3;
    deadlineAt: string;
    answered: number;
    totalQuestions: number;
    scorePct: number | null;
    status: "pending" | "active" | "submitted" | "cancelled";
  };
};

type SubmitEnvelope = {
  success: boolean;
  data: {
    sessionId: string;
    status: "submitted" | "expired" | "abandoned";
    scorePct: number;
    awardedLevel?: string;
    proceedNext: boolean;
  };
};

export type LatestResult = {
  sessionId: string;
  step: 1 | 2 | 3;
  status: "submitted" | "expired" | "abandoned";
  scorePct?: number;
  awardedLevel?: string; // your Level type if exported here
  proceedNext: boolean;
  submittedAt: string;
};

export const examApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    startExam: b.mutation<StartExamResult, StartExamBody>({
      query: ({ step, screen }) => ({
        url: `/exam/start`,
        method: "POST",
        params: { step },
        data: screen ? { screen } : undefined,
      }),
      transformResponse: (raw: ApiOk<StartExamResult>) => raw.data,
    }),
    answer: b.mutation<{ ok: true }, AnswerBody>({
      query: (body) => ({ url: "/exam/answer", method: "POST", data: body }),
    }),

    submit: b.mutation<SubmitEnvelope, SubmitBody>({
      query: (body) => ({ url: "/exam/submit", method: "POST", data: body }),
    }),

    status: b.query<StatusResult, string>({
      query: (sessionId) => ({ url: `/exam/status/${sessionId}` }),
    }),
    violation: b.mutation<
      { recorded: true },
      { sessionId: string; type: string; meta?: Record<string, unknown> }
    >({
      query: (body) => ({ url: "/exam/violation", method: "POST", data: body }),
    }),

    uploadVideoChunk: b.mutation<
      { ok: boolean },
      { sessionId: string; index: number; blob: Blob; mime: string }
    >({
      query: ({ sessionId, index, blob, mime }) => {
        const fd = new FormData();
        fd.append("sessionId", sessionId);
        fd.append("index", String(index));
        fd.append("file", blob, `chunk-${index}.webm`);
        fd.append("mime", mime);
        return {
          url: `/exam/video/upload-chunk`,
          method: "POST",
          body: fd,
        };
      },
    }),
    // src/services/exam.api.ts
    latestResult: b.query<{ latest: LatestResult | null }, void>({
      query: () => ({ url: "/exam/me/latest-result" }),
      transformResponse: (raw: unknown): { latest: LatestResult | null } => {
        // Normalize any envelope to { latest }
        const obj = (raw ?? {}) as Record<string, unknown>;
        const data = (obj.data as Record<string, unknown> | undefined) ?? obj;
        const latest =
          (data?.latest as LatestResult | null | undefined) ?? null;
        return { latest };
      },
      providesTags: ["Sessions"],
    }),
  }),
});

export const {
  useStartExamMutation,
  useAnswerMutation,
  useSubmitMutation,
  useStatusQuery,
  useViolationMutation,
  useUploadVideoChunkMutation,
  useLatestResultQuery,
} = examApi;
