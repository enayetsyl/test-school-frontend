// src/services/competency.api.ts
import { baseApi } from "./baseApi";
import type { ApiOk } from "@/types/api";
import { toPager, type PagerMeta } from "@/types/api";

export type ICompetency = {
  _id: string;
  code: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
};

export type ListCompetenciesArgs = {
  page?: number;
  limit?: number;
  q?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type ListCompetenciesResult = { items: ICompetency[]; meta: PagerMeta };

export const competencyApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    listCompetencies: b.query<
      ListCompetenciesResult,
      ListCompetenciesArgs | void
    >({
      query: (args) => ({
        url: "/competencies",
        params: args,
      }),
      transformResponse: (raw: ApiOk<ICompetency[]>) => ({
        items: raw.data,
        meta: toPager(raw.meta),
      }),
      providesTags: (res) =>
        res
          ? [
              ...res.items.map((c) => ({
                type: "Competencies" as const,
                id: c._id,
              })),
              { type: "Competencies" as const, id: "LIST" },
            ]
          : [{ type: "Competencies" as const, id: "LIST" }],
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
      ICompetency,
      Pick<ICompetency, "code" | "name" | "description">
    >({
      query: (body) => ({ url: "/competencies", method: "POST", data: body }),
      transformResponse: (raw: ApiOk<ICompetency>) => raw.data,
      invalidatesTags: [{ type: "Competencies", id: "LIST" }],
    }),

    updateCompetency: b.mutation<
      ICompetency,
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
      transformResponse: (raw: ApiOk<ICompetency>) => raw.data,
      invalidatesTags: (_res, _err, arg) => [
        { type: "Competencies", id: arg.id },
        { type: "Competencies", id: "LIST" },
      ],
    }),

    deleteCompetency: b.mutation<{ ok: boolean }, string>({
      query: (id) => ({ url: `/competencies/${id}`, method: "DELETE" }),
      transformResponse: () => ({ ok: true }),
      invalidatesTags: [{ type: "Competencies", id: "LIST" }],
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
