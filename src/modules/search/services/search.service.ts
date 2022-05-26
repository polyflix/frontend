import { environment } from '@env/environment'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'

import { Endpoint } from '@core/constants/endpoint.constant'
import { ApiVersion } from '@core/types/http.type'

export const searchApi = createApi({
  reducerPath: 'api/search',
  baseQuery: fetchBaseQuery({
    baseUrl: `${environment.api}/api/${ApiVersion.V2_0_0}`,
  }),
  tagTypes: [Endpoint.Search],
  endpoints: (builder) => ({
    /**
     * Get indexed element from query string
     */
    search: builder.query<any, string>({
      providesTags: (_0, _1, id) => [{ type: Endpoint.Search, id }],
      query: (query) => {
        return `${Endpoint.Search}?q=${query}&page=1&size=10`
      },
    }),
  }),
})

export const { useSearchQuery } = searchApi
