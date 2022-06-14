import { createApi } from '@reduxjs/toolkit/dist/query/react'

import { Endpoint } from '@core/constants/endpoint.constant'
import { fetchWithRefresh } from '@core/services/api.service'
import { ApiVersion } from '@core/types/http.type'

import { PaginatedAttachments } from '../models/attachment.model'
import { AttachmentParams } from '../models/attachment.params'

export const attachmentsApi = createApi({
  reducerPath: 'api/attachments',
  baseQuery: fetchWithRefresh(ApiVersion.V2),
  tagTypes: [Endpoint.Attachments],
  endpoints: (builder) => ({
    getUserAttachments: builder.query<PaginatedAttachments, AttachmentParams>({
      query: (params) => {
        return `${Endpoint.Attachments}?userId=${params.userId}&limit=${params.limit}&offset=${params.offset}`
      },
    }),
    getVideoAttachments: builder.query<PaginatedAttachments, string>({
      query: (videoId: string) => {
        return `${Endpoint.Attachments}/video/${videoId}`
      },
    }),
  }),
})

export const { useGetUserAttachmentsQuery, useGetVideoAttachmentsQuery } =
  attachmentsApi
