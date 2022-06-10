import { Group, PaginatedGroupResult } from '@admin/models/group.model'
import { GroupFilters } from '@admin/types/filters.type'
import { IGroupForm } from '@admin/types/form.type'
import { createApi } from '@reduxjs/toolkit/dist/query/react'

import { Container } from '@polyflix/di'

import { Endpoint } from '@core/constants/endpoint.constant'
import { RestCrudFilters } from '@core/filters/rest-crud.filter'
import { fetchWithRefresh } from '@core/services/api.service'
import { ApiVersion } from '@core/types/http.type'

const filterBuilder =
  Container.get<RestCrudFilters<GroupFilters>>(RestCrudFilters)

export const groupsApi = createApi({
  reducerPath: 'api/groups',
  baseQuery: fetchWithRefresh(ApiVersion.V2),
  tagTypes: [Endpoint.Groups],
  endpoints: (builder) => ({
    /**
     * Find one group
     */
    getGroup: builder.query<Group, string>({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      providesTags: (group, _0, _1) => {
        return [{ type: Endpoint.Groups, id: group!.id }]
      },
      query: (slug) => {
        return `${Endpoint.Groups}/${slug}`
      },
    }),

    /**
     * Find all groups
     */
    getGroups: builder.query<PaginatedGroupResult, GroupFilters>({
      providesTags: (result) =>
        result
          ? [
              ...result.data?.map(({ id }) => ({
                type: Endpoint.Groups as const,
                id,
              })),
              { type: Endpoint.Groups, id: 'LIST' },
            ]
          : [{ type: Endpoint.Groups, id: 'LIST' }],

      query: (filters) => {
        return `${Endpoint.Groups}${filterBuilder.createFilters(filters || {})}`
      },
    }),

    /**
     * Create one group
     */
    createGroup: builder.mutation<Group, IGroupForm>({
      query: (body: IGroupForm) => ({
        url: Endpoint.Groups,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: Endpoint.Groups, id: 'LIST' }],
    }),

    /**
     * Update one group
     */
    updateGroup: builder.mutation<Group, { id: string; body: IGroupForm }>({
      query: ({ id, body }) => ({
        url: `${Endpoint.Groups}/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, _1, { id }) =>
        result ? [{ type: Endpoint.Groups, id }] : [],
    }),

    /**
     * Delete one group
     */
    deleteGroup: builder.mutation<Group, { id: string }>({
      query: ({ id }) => ({
        url: `${Endpoint.Groups}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, _1, { id }) => [{ type: Endpoint.Groups, id }],
    }),
  }),
})

export const {
  useCreateGroupMutation,
  useDeleteGroupMutation,
  useGetGroupQuery,
  useGetGroupsQuery,
  useUpdateGroupMutation,
} = groupsApi
