import { createApi } from '@reduxjs/toolkit/dist/query/react'

import { Endpoint } from '@core/constants/endpoint.constant'
import { fetchWithRefresh } from '@core/services/api.service'
import { ApiVersion } from '@core/types/http.type'

import { IAttachmentForm } from '@attachments/types/form.type'

import { Attachment, PaginatedAttachments } from '../models/attachment.model'
import { AttachmentParams } from '../models/attachment.params'

export const attachmentsApi = createApi({
  reducerPath: 'api/attachments',
  baseQuery: fetchWithRefresh(ApiVersion.V2),
  tagTypes: [Endpoint.Attachments],
  endpoints: (builder) => ({
    getAttachment: builder.query<Attachment, { id: string }>({
      query: ({ id }) => {
        console.log(id)

        return `${Endpoint.Attachments}/${id}`
      },
    }),
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
    createAttachment: builder.mutation<Attachment, IAttachmentForm>({
      query: (body) => ({
        url: `${Endpoint.Attachments}`,
        method: 'POST',
        body: body,
      }),
    }),
    updateAttachment: builder.mutation<
      Attachment,
      { id: string; body: IAttachmentForm }
    >({
      query: ({ id, body }) => ({
        url: `${Endpoint.Attachments}/${id}`,
        method: 'PATCH',
        body: body,
      }),
    }),
    deleteAttachment: builder.mutation<Attachment, { id: string }>({
      query: ({ id }) => ({
        url: `${Endpoint.Attachments}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
})

export const {
  useGetAttachmentQuery,
  useGetUserAttachmentsQuery,
  useGetVideoAttachmentsQuery,
  useCreateAttachmentMutation,
  useUpdateAttachmentMutation,
  useDeleteAttachmentMutation,
} = attachmentsApi
