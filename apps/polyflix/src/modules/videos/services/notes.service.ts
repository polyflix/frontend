import { createApi } from '@reduxjs/toolkit/dist/query/react'

import { Endpoint } from '@constants/endpoint.constant'
import { fetchWithRefresh } from '@services/api.service'
import { ApiVersion } from '@types_/http.type'

import { Notes } from '@videos/models/notes.model'
import { Video } from '@videos/models/video.model'
import { INoteForm } from '@videos/types/form.type'

export const notesApi = createApi({
  reducerPath: 'api/notes',
  baseQuery: fetchWithRefresh(ApiVersion.V2),
  tagTypes: [Endpoint.Notes],
  endpoints: (builder) => ({
    /**
     * Get note by video slug.
     */
    getNote: builder.query<Notes, string>({
      providesTags: (_0, _1, slug) => [{ type: Endpoint.Notes, slug }],
      query: (slug) => {
        return `${Endpoint.Notes}/${slug}`
      },
    }),

    /**
     * Update note mutation
     */
    updateNote: builder.mutation<Video, { slug: string; body: INoteForm }>({
      query: ({ slug, body }) => ({
        url: `${Endpoint.Notes}/${slug}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_0, _1, { slug }) => [{ type: Endpoint.Notes, slug }],
    }),
  }),
})

export const { useGetNoteQuery, useUpdateNoteMutation } = notesApi
