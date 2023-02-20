import { createApi } from '@reduxjs/toolkit/dist/query/react'

import { Endpoint } from '@constants/endpoint.constant'
import { fetchWithRefresh } from '@services/api.service'
import { ApiVersion } from '@types_/http.type'

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
        return `${Endpoint.Attachments}/${id}`
      },
      providesTags: (result) =>
        result
          ? [{ type: Endpoint.Attachments, id: result.id }]
          : [Endpoint.Attachments],
    }),
    getUserAttachments: builder.query<PaginatedAttachments, AttachmentParams>({
      query: (params) => {
        return `${Endpoint.Attachments}?userId=${params.userId}&pageSize=${params.pageSize}&page=${params.page}`
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: Endpoint.Attachments,
                id,
              })),
              Endpoint.Attachments,
            ]
          : [Endpoint.Attachments],
    }),
    getVideoAttachments: builder.query<PaginatedAttachments, string>({
      query: (videoId: string) => {
        return `${Endpoint.Attachments}/video/${videoId}`
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: Endpoint.Attachments,
                id,
              })),
              Endpoint.Attachments,
            ]
          : [Endpoint.Attachments],
    }),
    createAttachment: builder.mutation<Attachment, IAttachmentForm>({
      query: (body) => ({
        url: `${Endpoint.Attachments}`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: [{ type: Endpoint.Attachments, id: 'LIST' }],
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
      invalidatesTags: (result) =>
        result ? [{ type: Endpoint.Attachments, id: result.id }] : [],
    }),
    deleteAttachment: builder.mutation<Attachment, { id: string }>({
      query: ({ id }) => ({
        url: `${Endpoint.Attachments}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, _1, { id }) => [{ type: Endpoint.Attachments, id }],
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
