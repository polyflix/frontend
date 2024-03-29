import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { UpsertUserVideoMeta } from '@stats/types/userMeta.type'

import { Container } from '@polyflix/di'

import { Endpoint } from '@constants/endpoint.constant'
import { RestCrudFilters } from '@core/filters/rest-crud.filter'
import { fetchWithRefresh } from '@services/api.service'
import { ApiVersion } from '@types_/http.type'

import { ReportModel, ReportState } from '@videos/models/report.model'
import { Video } from '@videos/models/video.model'
import { VideoFilters } from '@videos/types/filters.type'
import { IVideoForm } from '@videos/types/form.type'

const filterBuilder =
  Container.get<RestCrudFilters<VideoFilters>>(RestCrudFilters)

export const videosApi = createApi({
  reducerPath: 'api/videos',
  baseQuery: fetchWithRefresh(ApiVersion.V2),
  tagTypes: [Endpoint.Videos],
  endpoints: (builder) => ({
    /**
     * Get video by id query configuration.
     */
    getVideo: builder.query<Video, string>({
      providesTags: (_0, _1, slug) => [{ type: Endpoint.Videos, slug }],
      query: (slug) => {
        return `${Endpoint.Videos}/${slug}`
      },
    }),

    /**
     * Get Videos query configuration
     */
    getVideos: builder.query<
      { items: Video[]; totalCount: number },
      VideoFilters
    >({
      query: (filters) => {
        return `${Endpoint.Videos}${filterBuilder.createFilters(filters || {})}`
      },
      // Provides a list of Videos by slug.
      // If any mutation is executed that invalidate any of these tags, this query will re-run to be always up-to-date.
      // The `LIST` id is a "virtual id" we just made up to be able to invalidate this query specifically if a new `Video` element was added.
      providesTags: (result) =>
        // Is result available ?
        result
          ? [
              ...result.items.map(
                ({ slug }) => ({ type: Endpoint.Videos, slug } as const)
              ),
              { type: Endpoint.Videos, id: 'LIST' },
            ]
          : // An error occured, but we still want to refetch this query when the tag is invalidated.
            [{ type: Endpoint.Videos, id: 'LIST' }],
    }),

    getAdminVideos: builder.query<
      { items: Video[]; totalCount: number },
      VideoFilters
    >({
      query: (filters) => {
        return `${Endpoint.AdminVideos}${filterBuilder.createFilters(
          filters || {}
        )}`
      },
      // Provides a list of Videos by slug.
      // If any mutation is executed that invalidate any of these tags, this query will re-run to be always up-to-date.
      // The `LIST` id is a "virtual id" we just made up to be able to invalidate this query specifically if a new `Video` element was added.
      providesTags: (result) =>
        // Is result available ?
        result
          ? [
              ...result.items.map(
                ({ slug }) => ({ type: Endpoint.Videos, slug } as const)
              ),
              { type: Endpoint.Videos, id: 'LIST' },
            ]
          : // An error occured, but we still want to refetch this query when the tag is invalidated.
            [{ type: Endpoint.Videos, id: 'LIST' }],
    }),

    /**
     * Add a video mutation
     */
    addVideo: builder.mutation<Video, IVideoForm>({
      query: (body: IVideoForm) => ({
        url: Endpoint.Videos,
        method: 'POST',
        body,
        // body: { ...body, attachments: body.attachments.map((a) => a.id) }, // TODO #416
      }),
      // Invalidates all video-type queries providing the LIST id - after all, depending of the sort order
      // that newly created video could show up in any lists.
      invalidatesTags: [{ type: Endpoint.Videos, id: 'LIST' }],
    }),

    /**
     * Update video mutation
     */
    updateVideo: builder.mutation<Video, { slug: string; body: IVideoForm }>({
      query: ({ slug, body }) => ({
        url: `${Endpoint.Videos}/${slug}`,
        method: 'PUT',
        body,
        // body: { ...body, attachments: body.attachments.map((a) => a.id) }, // TODO #416
      }),
      // Invalidates all queries that subscribe to this Video `slug` only.
      // In this case, `getVideo` will be re-run. `getVideos` *might*  rerun, if this id was under its results.
      invalidatesTags: (result, _1, { slug }) =>
        result ? [{ type: Endpoint.Videos, slug }] : [],
    }),

    /**
     * Update video mutation
     */
    updateAdminVideo: builder.mutation<
      Video,
      { slug: string; body: IVideoForm }
    >({
      query: ({ slug, body }) => ({
        url: `${Endpoint.AdminVideos}/${slug}`,
        method: 'PUT',
        body,
      }),
      // Invalidates all queries that subscribe to this Video `slug` only.
      // In this case, `getVideo` will be re-run. `getVideos` *might*  rerun, if this id was under its results.
      invalidatesTags: (result, _1, { slug }) =>
        result ? [{ type: Endpoint.Videos, slug }] : [],
    }),
    /**
     * Delete Course mutation
     */
    deleteVideo: builder.mutation<Video, { slug: string }>({
      query: ({ slug }) => ({
        url: `${Endpoint.Videos}/${slug}`,
        method: 'DELETE',
      }),
      // Invalidates all queries that subscribe to this Video `slug` only.
      invalidatesTags: (_, _1, { slug }) => [{ type: Endpoint.Videos, slug }],
    }),

    updateWatchtime: builder.mutation<void, UpsertUserVideoMeta>({
      query: (body: UpsertUserVideoMeta) => ({
        url: `${Endpoint.Videos}/stats/watchtime`,
        method: 'POST',
        body,
      }),
    }),

    likeVideo: builder.mutation<void, string>({
      query: (videoId: string) => ({
        url: `${Endpoint.Videos}/stats/${videoId}/like`,
        method: 'PATCH',
        body: {
          videoId,
        },
      }),
    }),

    reportVideo: builder.mutation<void, { slug: string; body: ReportModel }>({
      query: ({ slug, body }: { slug: string; body: ReportModel }) => ({
        url: `${Endpoint.Videos}/${slug}/report`,
        method: 'POST',
        body: body,
      }),
    }),

    getReports: builder.query<
      { items: ReportModel[]; totalCount: number },
      void
    >({
      query: () => {
        return `${Endpoint.Videos}/report/list`
      },
      providesTags: () => [{ type: Endpoint.Videos, id: 'REPORT' }],
    }),

    updateReport: builder.mutation<
      void,
      { body: { state: ReportState }; report: ReportModel }
    >({
      query: ({
        body,
        report,
      }: {
        body: { state: ReportState }
        report: ReportModel
      }) => ({
        url: `${Endpoint.Videos}/${report.videoId}/report/${report.userId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: () => [{ type: Endpoint.Videos, id: 'REPORT' }],
    }),
  }),
})

export const {
  useGetVideosQuery,
  useGetAdminVideosQuery,
  useGetVideoQuery,
  useAddVideoMutation,
  useUpdateVideoMutation,
  useUpdateAdminVideoMutation,
  useDeleteVideoMutation,
  useUpdateWatchtimeMutation,
  useLikeVideoMutation,
  useReportVideoMutation,
  useGetReportsQuery,
  useUpdateReportMutation,
} = videosApi
