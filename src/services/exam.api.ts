// src/services/exam.api.ts
import { baseApi } from "./baseApi";

export type StartExamBody = {
  step: 1 | 2 | 3;
  screen?: { width: number; height: number };
};
export type StartExamResult = {
  sessionId: string;
  deadlineAt: string;
  totalQuestions: number;
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

export const examApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    startExam: b.mutation<StartExamResult, StartExamBody>({
      query: ({ step, screen }) => ({
        url: `/exam/start`,
        method: "POST",
        params: { step },
        data: screen ? { screen } : undefined,
      }),
    }),
    answer: b.mutation<{ ok: true }, AnswerBody>({
      query: (body) => ({ url: "/exam/answer", method: "POST", data: body }),
    }),
    submit: b.mutation<
      {
        status: "submitted";
        scorePct: number;
        awardedLevel: string;
        proceedNext: boolean;
      },
      SubmitBody
    >({
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
  }),
});

export const {
  useStartExamMutation,
  useAnswerMutation,
  useSubmitMutation,
  useStatusQuery,
  useViolationMutation,
  useUploadVideoChunkMutation,
} = examApi;
