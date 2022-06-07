import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { Permission } from '@roles/model/permission.model'

import { Endpoint } from '@core/constants/endpoint.constant'
import { fetchWithRefresh } from '@core/services/api.service'
import { ApiVersion } from '@core/types/http.type'

export const permissionsApi = createApi({
  reducerPath: 'api/permissions',
  baseQuery: fetchWithRefresh(ApiVersion.V2),
  tagTypes: [Endpoint.Permissions],
  endpoints: (builder) => ({
    getPermissions: builder.query<Permission, string>({
      providesTags: (_0, _1, name) => [{ type: Endpoint.Permissions, name }],
      query: () => `${Endpoint.Permissions}`,
    }),
  }),
})

export const { useGetPermissionsQuery } = permissionsApi
