// src/services/question.api.ts
import { baseApi } from "./baseApi";
import type { ApiOk, QueryError } from "@/types/api";
import { toPager, toQueryError, type PagerMeta } from "@/types/api";
import { api } from "@/utils/axios";

export type CreateQuestionDto = {
  competencyId: string; // <-- string id for create
  level: QuestionLevel;
  prompt: string;
  options: string[];
  correctIndex: number;
  isActive: boolean;
  meta?: { difficulty?: "easy" | "medium" | "hard"; tags?: string[] };
};

export type UpdateQuestionDto = Partial<CreateQuestionDto>;

export type QuestionLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type IQuestion = {
  _id: string;
  competencyId: {
    _id: string;
    name: string;
  };
  level: QuestionLevel;
  prompt: string;
  options: string[];
  correctIndex: number;
  isActive: boolean;
  meta?: { difficulty?: "easy" | "medium" | "hard"; tags?: string[] };
  createdAt: string;
  updatedAt: string;
};

export type ListQuestionsArgs = {
  page?: number;
  limit?: number;
  q?: string;
  level?: QuestionLevel;
  competencyId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type ListQuestionsResult = { items: IQuestion[]; meta: PagerMeta };

export const questionApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    listQuestions: b.query<ListQuestionsResult, ListQuestionsArgs | void>({
      query: (args) => ({ url: "/questions", params: args }),
      transformResponse: (raw: ApiOk<IQuestion[]>) => ({
        items: raw.data,
        meta: toPager(raw.meta),
      }),
      providesTags: [{ type: "Questions", id: "LIST" }],
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
      CreateQuestionDto
    >({
      query: (body) => ({ url: "/questions", method: "POST", data: body }),
      invalidatesTags: ["Questions"],
    }),
    updateQuestion: b.mutation<
      { question: IQuestion },
      { id: string; patch: UpdateQuestionDto }
    >({
      query: ({ id, patch }) => ({
        url: `/questions/${id}`,
        method: "PATCH",
        data: patch,
      }),
      invalidatesTags: ["Questions"],
    }),
    deleteQuestion: b.mutation<{ ok: boolean }, string>({
      query: (id) => ({ url: `/questions/${id}`, method: "DELETE" }),
      transformResponse: () => ({ ok: true }),
      invalidatesTags: [{ type: "Questions", id: "LIST" }],
    }),

    importQuestions: b.mutation<
      { ok: boolean },
      { file: File; mode?: "insert" | "upsert" }
    >({
      query: ({ file, mode = "upsert" }) => {
        const form = new FormData();
        form.append("file", file);
        form.append("mode", mode);
        return { url: "/questions/import", method: "POST", data: form };
      },
      transformResponse: () => ({ ok: true }),
      invalidatesTags: [{ type: "Questions", id: "LIST" }],
    }),

    exportQuestions: b.query<Blob, void>({
      async queryFn(): Promise<{ data: Blob } | { error: QueryError }> {
        try {
          const res = await api.get("/questions/export", {
            responseType: "blob",
          });

          // If the server accidentally wraps CSV in JSON, coerce to Blob anyway.
          const data = res.data;
          const blob =
            data instanceof Blob
              ? data
              : new Blob(
                  [typeof data === "string" ? data : JSON.stringify(data)],
                  {
                    type: "text/csv;charset=utf-8",
                  },
                );

          return { data: blob };
        } catch (e) {
          return { error: toQueryError(e) };
        }
      },
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
