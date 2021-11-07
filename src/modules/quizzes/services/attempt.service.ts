import { Container } from '@polyflix/di'

import { Endpoint } from '@core/constants/endpoint.constant'
import { CrudFilters } from '@core/filters/nestjsx-crud.filter'
import { api } from '@core/services/api.service'
import { Pagination } from '@core/types/nestjsx-crud.type'

import { Attempt } from '@quizzes/models/attempt.model'
import { QuizzAttemptFilters, QuizzFilters } from '@quizzes/types/filters.type'
import { QuizzAnswers } from '@quizzes/types/play.type'

// Get the filter builder from our DI system
const filterBuilder = Container.get<CrudFilters<QuizzFilters>>(CrudFilters)

// Inject quizzes attempts endpoints to the core API
export const quizzesAttemptsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Build the get attempts query
     */
    getAttempts: builder.query<
      Pagination<Attempt>,
      { id: string; filters: QuizzAttemptFilters }
    >({
      query: ({ filters, id }) =>
        `${Endpoint.Quizzes}/${id}/${
          Endpoint.Attempts
        }${filterBuilder.createFilters(filters)}`,
      providesTags: (result) =>
        // Is result available ?
        result
          ? [
              ...result.data.map(
                ({ id }) => ({ type: Endpoint.Attempts, id } as const)
              ),
              { type: Endpoint.Attempts, id: 'LIST' },
            ]
          : // An error occured, but we still want to refetch this query when the tag is invalidated.
            [{ type: Endpoint.Attempts, id: 'LIST' }],
    }),
    /**
     * Submit an attempt mutation
     */
    submitAttempt: builder.mutation<
      Attempt,
      { id: string; answers: QuizzAnswers }
    >({
      query: ({ answers, id }) => ({
        url: `${Endpoint.Quizzes}/${id}/attempts`,
        method: 'POST',
        body: { answers },
      }),
      // Invalidates all Quizz-type queries providing the LIST id - after all, depending of the sort order
      // that newly created quizz could show up in any lists.
      invalidatesTags: [{ type: Endpoint.Attempts, id: 'LIST' }],
    }),
  }),
})

export const { useSubmitAttemptMutation, useGetAttemptsQuery } =
  quizzesAttemptsApi
