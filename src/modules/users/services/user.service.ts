import { createApi } from '@reduxjs/toolkit/dist/query/react'

import { Endpoint } from '@core/constants/endpoint.constant'
import { fetchWithRefresh } from '@core/services/api.service'
import { PaginationFilter } from '@core/types/filters.type'
import { ApiVersion } from '@core/types/http.type'

import { User } from '@users/models/user.model'

export const usersApi = createApi({
  reducerPath: 'api/users',
  baseQuery: fetchWithRefresh(ApiVersion.V2),
  tagTypes: [Endpoint.Users],
  endpoints: (builder) => ({
    /**
     * Get user by id query configuration.
     */
    getUser: builder.query<User, string>({
      providesTags: (_0, _1, id) => [{ type: Endpoint.Users, id }],
      query: (id) => {
        return `${Endpoint.Users}/${id}`
      },
    }),

    /**
     * Get Users query configuration
     */
    getUsers: builder.query<
      {
        currentPage: number
        data: User[]
        totalElements: number
        totalPages: number
      },
      PaginationFilter
    >({
      query: ({ page = 1, pageSize = 1 }) =>
        `${Endpoint.Users}?page=${page}&size=${pageSize}`,
      // Provides a list of Users .
      // If any mutation is executed that invalidate any of these tags, this query will re-run to be always up-to-date.
      // The `LIST` id is a "virtual id" we just made up to be able to invalidate this query specifically if a new `User` element was added.
      providesTags: (result) =>
        // Is result available ?
        result
          ? [
              ...result.data.map(
                ({ id }) => ({ type: Endpoint.Users, id } as const)
              ),
              { type: Endpoint.Users, id: 'LIST' },
            ]
          : // An error occured, but we still want to refetch this query when the tag is invalidated.
            [{ type: Endpoint.Users, id: 'LIST' }],
    }),

    /**
     * Update user mutation
     */
    updateUser: builder.mutation<User, { id: string; body: User }>({
      query: ({ id, body }) => ({
        url: `${Endpoint.Users}/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, _1, { id }) =>
        result ? [{ type: Endpoint.Users, id }] : [],
    }),
  }),
})

export const { useGetUserQuery, useGetUsersQuery, useUpdateUserMutation } =
  usersApi
