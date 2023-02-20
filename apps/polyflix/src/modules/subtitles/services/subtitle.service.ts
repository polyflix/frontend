import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { SubtitleResponse } from '@subtitles/models/subtitle.model'
import { SubtitleLanguages } from '@subtitles/types/subtitle.type'

import { Endpoint } from '@constants/endpoint.constant'
import { fetchWithRefresh } from '@services/api.service'
import { ApiVersion } from '@types_/http.type'

export const subtitlesApi = createApi({
  reducerPath: 'api/subtitles',
  baseQuery: fetchWithRefresh(ApiVersion.V2),
  endpoints: (builder) => ({
    getVideoSubtitle: builder.query<
      SubtitleResponse,
      { slug: string; language: SubtitleLanguages }
    >({
      query: ({ slug, language }) => {
        return `${Endpoint.Subtitles}/${slug}/${language}`
      },
    }),
  }),
})

export const { useGetVideoSubtitleQuery } = subtitlesApi
