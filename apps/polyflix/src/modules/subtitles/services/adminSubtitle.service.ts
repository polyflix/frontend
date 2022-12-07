import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { SubtitleLanguages } from '@subtitles/types/subtitle.type'

import { Endpoint } from '@core/constants/endpoint.constant'
import { fetchWithRefresh } from '@core/services/api.service'
import { ApiVersion } from '@core/types/http.type'

export const adminSubtitlesApi = createApi({
  reducerPath: 'api/admin/subtitles',
  baseQuery: fetchWithRefresh(ApiVersion.V2),
  endpoints: (builder) => ({
    generateSubtitles: builder.mutation<
      any,
      { slug: string; language: SubtitleLanguages }
    >({
      query: ({ slug, language }) => ({
        url: `${Endpoint.AdminSubtitles}`,
        method: 'POST',
        body: {
          videoSlug: slug,
          language,
        },
      }),
    }),
  }),
})

export const { useGenerateSubtitlesMutation } = adminSubtitlesApi
