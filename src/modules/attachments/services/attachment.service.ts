import { createApi } from '@reduxjs/toolkit/dist/query/react'

import { Endpoint } from '@core/constants/endpoint.constant'
import { fetchWithRefresh } from '@core/services/api.service'
import { ApiVersion } from '@core/types/http.type'

import { Attachment } from '../models/attachment.model'
import { AttachmentParams } from '../models/attachment.params'

type PaginatedAttachmentsResponseType = {
  items: Attachment[],
  totalCount: number,
}

export const attachmentsApi = createApi({
  reducerPath: 'api/attachments',
  baseQuery: fetchWithRefresh(ApiVersion.V2),
  tagTypes: [Endpoint.Attachments],
  endpoints: (builder) => ({
    getUserAttachments: builder.query<Attachment[], AttachmentParams>({
      query: () => {
        return `${Endpoint.Attachments}`
      },
      transformResponse(baseQueryReturnValue: PaginatedAttachmentsResponseType): Attachment[] {
        return baseQueryReturnValue.items as Attachment[]
      }
    }),
    getVideoAttachments: builder.query<Attachment[], string>({
      query: (videoId: string) => {
        return `${Endpoint.Attachments}/video/${videoId}`
      },
      transformResponse(baseQueryReturnValue: PaginatedAttachmentsResponseType) {
        return baseQueryReturnValue.items as Attachment[]
      },
    }),
  }),
})

export const { useGetUserAttachmentsQuery, useGetVideoAttachmentsQuery } =
  attachmentsApi
