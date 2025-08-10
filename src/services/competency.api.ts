// src/services/competency.api.ts
import { baseApi } from "./baseApi";
import type { PageMeta } from "@/types/api";
import { normalizeList } from "@/types/api";

export type ICompetency = {
  _id: string;
  code: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

export const competencyApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    listCompetencies: b.query<
      { items: ICompetency[]; meta?: PageMeta },
      {
        page?: number;
        limit?: number;
        q?: string;
        sortBy?: "name" | "code" | "createdAt";
        sortOrder?: "asc" | "desc";
      } | void
    >({
      query: (params) => ({ url: "/competencies", params }),
      transformResponse: (raw: unknown) => normalizeList<ICompetency>(raw),
      providesTags: ["Competencies"],
    }),

    getCompetency: b.query<{ competency: ICompetency }, string>({
      query: (id) => ({ url: `/competencies/${id}` }),
      transformResponse: (raw: unknown) => {
        // Accept { data }, { competency }, or the object itself
        if (raw && typeof raw === "object") {
          const o = raw as Record<string, unknown>;
          const competency =
            (o.data as ICompetency | undefined) ??
            (o.competency as ICompetency | undefined) ??
            (raw as ICompetency);
          return { competency };
        }
        return { competency: raw as ICompetency };
      },
      providesTags: (_r, _e, id) => [{ type: "Competencies", id }],
    }),

    createCompetency: b.mutation<
      { competency: ICompetency },
      { code: string; name: string; description?: string }
    >({
      query: (body) => ({ url: "/competencies", method: "POST", data: body }),
      invalidatesTags: ["Competencies"],
    }),

    updateCompetency: b.mutation<
      { competency: ICompetency },
      {
        id: string;
        patch: Partial<Pick<ICompetency, "code" | "name" | "description">>;
      }
    >({
      query: ({ id, patch }) => ({
        url: `/competencies/${id}`,
        method: "PATCH",
        data: patch,
      }),
      invalidatesTags: ["Competencies"],
    }),

    deleteCompetency: b.mutation<{ deleted: true }, string>({
      query: (id) => ({ url: `/competencies/${id}`, method: "DELETE" }),
      invalidatesTags: ["Competencies"],
    }),
  }),
});

export const {
  useListCompetenciesQuery,
  useGetCompetencyQuery,
  useCreateCompetencyMutation,
  useUpdateCompetencyMutation,
  useDeleteCompetencyMutation,
} = competencyApi;
