// src/services/question.api.ts
import { baseApi } from "./baseApi";
import type { PageMeta, QueryError } from "@/types/api";
import { normalizeList, toQueryError } from "@/types/api";
import { api } from "@/utils/axios";

export type QuestionLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type IQuestion = {
  _id: string;
  competencyId: string;
  level: QuestionLevel;
  prompt: string;
  options: string[];
  correctIndex: number;
  isActive: boolean;
  meta?: { difficulty?: "easy" | "medium" | "hard"; tags?: string[] };
  createdAt: string;
  updatedAt: string;
};

export const questionApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    listQuestions: b.query<
      { items: IQuestion[]; meta?: PageMeta },
      {
        page?: number;
        limit?: number;
        q?: string;
        level?: QuestionLevel;
        competencyId?: string;
        isActive?: boolean;
        sortBy?: "createdAt" | "level" | "prompt";
        sortOrder?: "asc" | "desc";
      } | void
    >({
      query: (params) => ({ url: "/questions", params }),
      transformResponse: (raw: unknown) => normalizeList<IQuestion>(raw),
      providesTags: ["Questions"],
    }),

    getQuestion: b.query<{ question: IQuestion }, string>({
      query: (id) => ({ url: `/questions/${id}` }),
      transformResponse: (raw: unknown) => {
        if (raw && typeof raw === "object") {
          const o = raw as Record<string, unknown>;
          const question =
            (o.data as IQuestion | undefined) ??
            (o.question as IQuestion | undefined) ??
            (raw as IQuestion);
          return { question };
        }
        return { question: raw as IQuestion };
      },
      providesTags: (_r, _e, id) => [{ type: "Questions", id }],
    }),

    createQuestion: b.mutation<
      { question: Pick<IQuestion, "_id"> },
      Omit<IQuestion, "_id" | "createdAt" | "updatedAt">
    >({
      query: (body) => ({ url: "/questions", method: "POST", data: body }),
      invalidatesTags: ["Questions"],
    }),

    updateQuestion: b.mutation<
      { question: IQuestion },
      { id: string; patch: Partial<IQuestion> }
    >({
      query: ({ id, patch }) => ({
        url: `/questions/${id}`,
        method: "PATCH",
        data: patch,
      }),
      invalidatesTags: ["Questions"],
    }),

    deleteQuestion: b.mutation<{ deleted: true }, string>({
      query: (id) => ({ url: `/questions/${id}`, method: "DELETE" }),
      invalidatesTags: ["Questions"],
    }),

    importQuestions: b.mutation<
      { imported: number },
      { file: File; mode?: "upsert" | "insert" }
    >({
      query: ({ file, mode = "upsert" }) => {
        const form = new FormData();
        form.append("file", file);
        return {
          url: `/questions/import`,
          method: "POST",
          params: { mode },
          data: form,
        };
      },
      invalidatesTags: ["Questions"],
    }),

    exportQuestions: b.query<Blob, void>({
      async queryFn(): Promise<{ data: Blob } | { error: QueryError }> {
        try {
          const res = await api.get(`/questions/export`, {
            responseType: "blob",
          });
          return { data: res.data as Blob };
        } catch (e: unknown) {
          return { error: toQueryError(e) };
        }
      },
      providesTags: ["Questions"],
    }),
  }),
});

export const {
  useListQuestionsQuery,
  useGetQuestionQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  useImportQuestionsMutation,
  useExportQuestionsQuery,
} = questionApi;
