import { UpsertUserVideoMeta } from '@stats/types/userMeta.type'

import { Endpoint } from '@core/constants/endpoint.constant'
import { api } from '@core/services/api.service'

export const statsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    updateWatchtime: builder.mutation<void, UpsertUserVideoMeta>({
      query: (body: UpsertUserVideoMeta) => ({
        url: `${Endpoint.Stats}/watchtime`,
        method: 'POST',
        body,
      }),
    }),
    likeVideo: builder.mutation<void, string>({
      query: (videoId: string) => ({
        url: `${Endpoint.Stats}/like`,
        method: 'PATCH',
        body: {
          videoId,
        },
      }),
    }),
  }),
})

export const { useUpdateWatchtimeMutation, useLikeVideoMutation } = statsApi
