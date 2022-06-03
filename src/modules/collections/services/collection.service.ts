import { createApi } from '@reduxjs/toolkit/dist/query/react'

import { Container } from '@polyflix/di'

import { Endpoint } from '@core/constants/endpoint.constant'
import { RestCrudFilters } from '@core/filters/rest-crud.filter'
import { fetchWithRefresh } from '@core/services/api.service'
import { ApiVersion } from '@core/types/http.type'

import { Collection } from '@collections/models/collection.model'
import { CollectionFilters } from '@collections/types/filters.type'
import { ICollectionForm } from '@collections/types/form.type'

const filterBuilder =
  Container.get<RestCrudFilters<CollectionFilters>>(RestCrudFilters)

// Inject collections endpoints to the core API
export const collectionsApi = createApi({
  reducerPath: 'api/modules',
  baseQuery: fetchWithRefresh(ApiVersion.V2),
  tagTypes: [Endpoint.Modules],
  endpoints: (builder) => ({
    /**
     * Get collection by id query configuration.
     */
    getCollection: builder.query<
      Collection,
      { slug: string; filters?: CollectionFilters; accessKey?: string }
    >({
      providesTags: (_0, _1, { slug }) => [{ type: Endpoint.Modules, slug }],
      query: ({ slug, filters, accessKey }) => {
        return `${Endpoint.Modules}/${slug}${filterBuilder.createFilters(
          filters || {}
        )}${accessKey ? `&accessKey=${accessKey}` : ''}`
      },
    }),

    /**
     * Get Collections query configuration
     */
    getCollections: builder.query<
      { data: Collection[]; total: number; page: number; pageSize: number },
      CollectionFilters
    >({
      query: (filters?: CollectionFilters) => {
        return `${Endpoint.Modules}${filterBuilder.createFilters(
          filters || {}
        )}`
      },
      // Provides a list of Collections by id.
      // If any mutation is executed that invalidate any of these tags, this query will re-run to be always up-to-date.
      // The `LIST` id is a "virtual id" we just made up to be able to invalidate this query specifically if a new `Collection` element was added.
      providesTags: (result) =>
        // Is result available ?
        result
          ? [
              ...result.data.map(
                ({ id }) => ({ type: Endpoint.Modules, id } as const)
              ),
              { type: Endpoint.Modules, id: 'LIST' },
            ]
          : // An error occured, but we still want to refetch this query when the tag is invalidated.
            [{ type: Endpoint.Modules, id: 'LIST' }],
    }),

    /**
     * Add a Collection mutation
     */
    addCollection: builder.mutation<Collection, ICollectionForm>({
      query: (body: ICollectionForm) => ({
        url: `${Endpoint.Modules}?join=passwords`,
        method: 'POST',
        body,
      }),
      // Invalidates all Collection-type queries providing the LIST id - after all, depending of the sort order
      // that newly created Collection could show up in any lists.
      invalidatesTags: [{ type: Endpoint.Modules, id: 'LIST' }],
    }),

    /**
     * Update Collection mutation
     */
    updateCollection: builder.mutation<
      Collection,
      { slug: string; body: ICollectionForm }
    >({
      query: ({ slug, body }) => ({
        url: `${Endpoint.Modules}/${slug}?join=passwords`,
        method: 'PUT',
        body,
      }),
      // Invalidates all queries that subscribe to this Collection `id` only.
      // In this case, `getCollection` will be re-run. `getCollections` *might*  rerun, if this id was under its results.
      invalidatesTags: (result, _1, { slug }) =>
        result ? [{ type: Endpoint.Modules, slug }] : [],
    }),

    deleteCollection: builder.mutation<Collection, { slug: string }>({
      query: ({ slug }) => ({
        url: `${Endpoint.Modules}/${slug}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, _1, { slug }) => [{ type: Endpoint.Modules, slug }],
    }),
  }),
})

export const {
  useGetCollectionsQuery,
  useGetCollectionQuery,
  useAddCollectionMutation,
  useUpdateCollectionMutation,
  useDeleteCollectionMutation,
} = collectionsApi
