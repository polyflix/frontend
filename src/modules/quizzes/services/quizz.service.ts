import { createApi } from '@reduxjs/toolkit/dist/query/react'

import { Container } from '@polyflix/di'

import { Endpoint } from '@core/constants/endpoint.constant'
import { CrudFilters } from '@core/filters/nestjsx-crud.filter'
import { Element } from '@core/models/element.model'
import { fetchWithRefresh } from '@core/services/api.service'
import { ApiVersion } from '@core/types/http.type'
import { Pagination } from '@core/types/nestjsx-crud.type'

import { Quizz } from '@quizzes/models/quizz.model'
import { QuizzFilters } from '@quizzes/types/filters.type'
import { IQuizzForm } from '@quizzes/types/form.type'

// Get the filter builder from our DI system
const filterBuilder = Container.get<CrudFilters<QuizzFilters>>(CrudFilters)

// Inject quizzes endpoints to the core API
export const quizzesApi = createApi({
  reducerPath: 'api/quizzes',
  baseQuery: fetchWithRefresh(ApiVersion.V2),
  tagTypes: [Endpoint.Quizzes],
  endpoints: (builder) => ({
    /**
     * Get quizz by id query configuration.
     */
    getQuizz: builder.query<
      Element<Quizz>,
      { id: string; filters?: QuizzFilters }
    >({
      providesTags: (_0, _1, { id }) => [{ type: Endpoint.Quizzes, id }],
      query: ({ id, filters }) => {
        return `${Endpoint.Quizzes}/${id}${filterBuilder.createFilters(
          filters || {}
        )}`
      },
    }),

    /**
     * Get quizzes query configuration
     */
    getQuizzes: builder.query<Pagination<Element<Quizz>>, QuizzFilters>({
      query: (filters?: QuizzFilters) => {
        return `${Endpoint.Quizzes}${filterBuilder.createFilters(
          filters || {}
        )}`
      },
      // Provides a list of Quizzes by id.
      // If any mutation is executed that invalidate any of these tags, this query will re-run to be always up-to-date.
      // The `LIST` id is a "virtual id" we just made up to be able to invalidate this query specifically if a new `Quizz` element was added.
      providesTags: (result) =>
        // Is result available ?
        result
          ? [
              ...result.data.map(
                ({ id }) => ({ type: Endpoint.Quizzes, id } as const)
              ),
              { type: Endpoint.Quizzes, id: 'LIST' },
            ]
          : // An error occured, but we still want to refetch this query when the tag is invalidated.
            [{ type: Endpoint.Quizzes, id: 'LIST' }],
    }),

    /**
     * Add a quizz mutation
     */
    addQuizz: builder.mutation<Element<Quizz>, IQuizzForm>({
      query: (body: IQuizzForm) => ({
        url: Endpoint.Quizzes,
        method: 'POST',
        body,
      }),
      // Invalidates all Quizz-type queries providing the LIST id - after all, depending of the sort order
      // that newly created quizz could show up in any lists.
      invalidatesTags: [{ type: Endpoint.Quizzes, id: 'LIST' }],
    }),

    /**
     * Update quizz mutation
     */
    updateQuizz: builder.mutation<
      Element<Quizz>,
      { id: string; body: IQuizzForm }
    >({
      query: ({ id, body }) => ({
        url: `${Endpoint.Quizzes}/${id}`,
        method: 'PUT',
        body,
      }),
      // Invalidates all queries that subscribe to this Quizz `id` only.
      // In this case, `getQuizz` will be re-run. `getQuizzes` *might*  rerun, if this id was under its results.
      invalidatesTags: (result, _1, { id }) =>
        result ? [{ type: Endpoint.Quizzes, id }] : [],
    }),

    /**
     * Delete quizz mutation
     */
    deleteQuizz: builder.mutation<Quizz, { id: string }>({
      query: ({ id }) => ({
        url: `${Endpoint.Quizzes}/${id}`,
        method: 'DELETE',
      }),
      // Invalidates all queries that subscribe to this Quizz `id` only.
      // In this case, `getQuizz` will be re-run. `getQuizzes` *might*  rerun, if this id was under its results.
      invalidatesTags: (_, _1, { id }) => [{ type: Endpoint.Quizzes, id }],
    }),
  }),
})

export const {
  useGetQuizzesQuery,
  useGetQuizzQuery,
  useAddQuizzMutation,
  useUpdateQuizzMutation,
  useDeleteQuizzMutation,
} = quizzesApi
