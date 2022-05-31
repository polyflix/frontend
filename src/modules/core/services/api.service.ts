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

import { logoutUser, refreshToken } from '@auth/reducers/auth.slice'

import keycloakClient from '../../../../src/keycloak/config'

// Here we configure the fetch base query of our API.
// We define the endoint, the headers configuration etc.
export const baseQuery = (version: ApiVersion) =>
  fetchBaseQuery({
    baseUrl: `${environment.api}/api/${version}`,
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
export const fetchWithRefresh: (
  apiVersion: ApiVersion
) => BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =
  (version: ApiVersion) => async (args, api, extraOptions) => {
    let result = await baseQuery(version)(args, api, extraOptions)
    if (result.error && result.error.status === 401) {
      try {
        // Try to get a new token
        await keycloakClient.updateToken(-1)

        // Store new token in the state
        store.dispatch(refreshToken({ token: keycloakClient.token!! }))

        // Retry the query
        result = await baseQuery(version)(args, api, extraOptions)
      } catch {
        store.dispatch(logoutUser())
      }
    }
    return result
  }

// Finally, we export an API base object, in order to configure the store.
// Every modules using this should inject it own endpoints.
// See : https://redux-toolkit.js.org/rtk-query/usage/code-splitting
export const api = createApi({
  reducerPath: 'api/legacy',
  baseQuery: fetchWithRefresh(ApiVersion.V1),
  tagTypes: [
    Endpoint.Stats,
    Endpoint.Quizzes,
    Endpoint.Attempts,
    Endpoint.Collections,
    Endpoint.Courses,
    Endpoint.Links,
  ],
  endpoints: () => ({}),
})
