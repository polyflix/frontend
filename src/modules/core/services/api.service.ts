import { environment } from '@env/environment'
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'

import { Endpoint } from '@core/constants/endpoint.constant'
import { RootState, store } from '@core/store'
import { ApiVersion } from '@core/types/http.type'

import { authenticateUser, logoutUser } from '@auth/reducers/auth.slice'

// Here we configure the fetch base query of our API.
// We define the endoint, the headers configuration etc.
const baseQuery = fetchBaseQuery({
  baseUrl: `${environment.api}/api/${ApiVersion.V1}`,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})

// Here we define a custom fetch behavior in order to refresh the authentication
// if a request returns a 401 Unauthorized.
const fetchWithRefresh: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)
  if (result.error && result.error.status === 401) {
    // try to get a new token
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)
    if (refreshResult.data) {
      const { token, user } = result.data || {
        token: undefined,
        user: undefined,
      }
      // store the new token
      if (token && user) {
        // Re-authenticate the user
        store.dispatch(authenticateUser({ token, user }))
        // Retry the query
        result = await baseQuery(args, api, extraOptions)
      }
    } else {
      store.dispatch(logoutUser())
    }
  }
  return result
}

// Finally, we export an API base object, in order to configure the store.
// Every modules using this should inject it own endpoints.
// See : https://redux-toolkit.js.org/rtk-query/usage/code-splitting
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchWithRefresh,
  endpoints: () => ({}),
  tagTypes: Object.values(Endpoint),
})
