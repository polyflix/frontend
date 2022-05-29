import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { SubtitleLanguages } from '@subtitles/types/subtitle.type'

import { Endpoint } from '@core/constants/endpoint.constant'
import { fetchWithRefresh } from '@core/services/api.service'
import { ApiVersion } from '@core/types/http.type'

export const subtitlesApi = createApi({
  reducerPath: 'api/subtitles',
  baseQuery: fetchWithRefresh(ApiVersion.V2),
  endpoints: (builder) => ({
    getVideoSubtitle: builder.query<
      any,
      { slug: string; language: SubtitleLanguages }
    >({
      query: ({ slug, language }) => {
        return `${Endpoint.Subtitles}/${slug}/${language}`
      },
    }),
  }),
})

export const { useGetVideoSubtitleQuery } = subtitlesApi
