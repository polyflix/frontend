import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { Role } from '@roles/model/role.model'

import { Endpoint } from '@core/constants/endpoint.constant'
import { fetchWithRefresh } from '@core/services/api.service'
import { ApiVersion } from '@core/types/http.type'

export const rolesApi = createApi({
  reducerPath: 'api/roles',
  baseQuery: fetchWithRefresh(ApiVersion.V2),
  tagTypes: [Endpoint.Roles],
  endpoints: (builder) => ({
    getRoles: builder.query<Role[], void>({
      providesTags: (_0, _1, name) => [{ type: Endpoint.Roles, name }],
      query: () => `${Endpoint.Roles}`,
    }),
  }),
})

export const { useGetRolesQuery } = rolesApi
