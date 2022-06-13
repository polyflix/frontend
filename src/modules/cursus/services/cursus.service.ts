import { Cursus } from '@cursus/models/cursus.model'
import { CursusFilters } from '@cursus/types/filters.type'
import { ICursusForm } from '@cursus/types/form.type'
import { createApi } from '@reduxjs/toolkit/dist/query/react'

import { Container } from '@polyflix/di'

import { Endpoint } from '@core/constants/endpoint.constant'
import { RestCrudFilters } from '@core/filters/rest-crud.filter'
import { fetchWithRefresh } from '@core/services/api.service'
import { ApiVersion } from '@core/types/http.type'

const filterBuilder =
  Container.get<RestCrudFilters<CursusFilters>>(RestCrudFilters)

// Inject Cursus endpoints to the core API
export const cursusApi = createApi({
  reducerPath: 'api/cursus',
  baseQuery: fetchWithRefresh(ApiVersion.V2),
  tagTypes: [Endpoint.Cursus],
  endpoints: (builder) => ({
    /**
     * Get Cursus by id query configuration.
     */
    getCursus: builder.query<Cursus, { slug: string; filters?: CursusFilters }>(
      {
        providesTags: (_0, _1, { slug }) => [{ type: Endpoint.Cursus, slug }],
        query: ({ slug, filters }) => {
          return `${Endpoint.Cursus}/${slug}${filterBuilder.createFilters(
            filters || {}
          )}`
        },
      }
    ),

    /**
     * Get Cursus query configuration
     */
    getAllCursus: builder.query<
      { data: Cursus[]; total: number; page: number; pageSize: number },
      CursusFilters
    >({
      query: (filters?: CursusFilters) => {
        return `${Endpoint.Cursus}${filterBuilder.createFilters(filters || {})}`
      },

      // Provides a list of Cursus by id.
      // If any mutation is executed that invalidate any of these tags, this query will re-run to be always up-to-date.
      // The `LIST` id is a "virtual id" we just made up to be able to invalidate this query specifically if a new `Cursus` element was added.
      providesTags: (result) =>
        // Is result available ?
        result
          ? [
              ...result.data.map(
                ({ id }) => ({ type: Endpoint.Cursus, id } as const)
              ),
              { type: Endpoint.Cursus, id: 'LIST' },
            ]
          : // An error occured, but we still want to refetch this query when the tag is invalidated.
            [{ type: Endpoint.Cursus, id: 'LIST' }],
    }),
    /**
     * Add a Cursus mutation
     */
    addCursus: builder.mutation<Cursus, ICursusForm>({
      query: (body: ICursusForm) => ({
        url: Endpoint.Cursus,
        method: 'POST',
        body,
      }),
      // Invalidates all Cursus-type queries providing the LIST id - after all, depending of the sort order
      // that newly created Cursus could show up in any lists.
      invalidatesTags: [{ type: Endpoint.Cursus, id: 'LIST' }],
    }),

    /**
     * Update Cursus mutation
     */
    updateCursus: builder.mutation<Cursus, { slug: string; body: ICursusForm }>(
      {
        query: ({ slug, body }) => ({
          url: `${Endpoint.Cursus}/${slug}`,
          method: 'PUT',
          body,
        }),
        // Invalidates all queries that subscribe to this Cursus `id` only.
        // In this case, `getCursus` will be re-run. `getCursus` *might*  rerun, if this id was under its results.
        invalidatesTags: (result, _1, { slug }) =>
          result ? [{ type: Endpoint.Cursus, slug }] : [],
      }
    ),

    /**
     * Delete Cursus mutation
     */
    deleteCursus: builder.mutation<Cursus, { slug: string }>({
      query: ({ slug }) => ({
        url: `${Endpoint.Cursus}/${slug}`,
        method: 'DELETE',
      }),
      // Invalidates all queries that subscribe to this Cursus `id` only.
      // In this case, `getCursus` will be re-run. `getCursus` *might*  rerun, if this id was under its results.
      invalidatesTags: (_, _1, { slug }) => [{ type: Endpoint.Cursus, slug }],
    }),
  }),
})

export const {
  useGetCursusQuery,
  useGetAllCursusQuery,
  useAddCursusMutation,
  useUpdateCursusMutation,
  useDeleteCursusMutation,
} = cursusApi
