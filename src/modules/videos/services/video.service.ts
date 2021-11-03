import { Container } from '@polyflix/di'

import { Endpoint } from '@core/constants/endpoint.constant'
import { RestCrudFilters } from '@core/filters/rest-crud.filter'
import { api } from '@core/services/api.service'

import { Video } from '@videos/models/video.model'
import { VideoFilters } from '@videos/types/filters.type'
import { IVideoForm } from '@videos/types/form.type'

const filterBuilder =
  Container.get<RestCrudFilters<VideoFilters>>(RestCrudFilters)

// Inject videos endpoints to the core API
export const videosApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get video by id query configuration.
     */
    getVideo: builder.query<Video, string>({
      providesTags: (_0, _1, id) => [{ type: Endpoint.Videos, id }],
      query: (id) => {
        return `${Endpoint.Videos}/${id}`
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
      // Provides a list of Videos by id.
      // If any mutation is executed that invalidate any of these tags, this query will re-run to be always up-to-date.
      // The `LIST` id is a "virtual id" we just made up to be able to invalidate this query specifically if a new `Video` element was added.
      providesTags: (result) =>
        // Is result available ?
        result
          ? [
              ...result.items.map(
                ({ id }) => ({ type: Endpoint.Videos, id } as const)
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
      }),
      // Invalidates all video-type queries providing the LIST id - after all, depending of the sort order
      // that newly created video could show up in any lists.
      invalidatesTags: [{ type: Endpoint.Videos, id: 'LIST' }],
    }),

    /**
     * Update video mutation
     */
    updateVideo: builder.mutation<Video, { id: string; body: IVideoForm }>({
      query: ({ id, body }) => ({
        url: `${Endpoint.Videos}/${id}`,
        method: 'PUT',
        body,
      }),
      // Invalidates all queries that subscribe to this Video `id` only.
      // In this case, `getVideo` will be re-run. `getVideos` *might*  rerun, if this id was under its results.
      invalidatesTags: (result, _1, { id }) =>
        result ? [{ type: Endpoint.Videos, id }] : [],
    }),
  }),
})

export const {
  useGetVideosQuery,
  useGetVideoQuery,
  useAddVideoMutation,
  useUpdateVideoMutation,
} = videosApi
