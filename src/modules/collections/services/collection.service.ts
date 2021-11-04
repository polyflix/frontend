import { Collection } from '@collections/models/collection.model'
import { CollectionFilters } from '@collections/types/filters.type'
import { ICollectionForm } from '@collections/types/form.type'

import { Container } from '@polyflix/di'

import { Endpoint } from '@core/constants/endpoint.constant'
import { RestCrudFilters } from '@core/filters/rest-crud.filter'
import { api } from '@core/services/api.service'

const filterBuilder =
  Container.get<RestCrudFilters<CollectionFilters>>(RestCrudFilters)

// Inject collections endpoints to the core API
export const collectionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get collection by id query configuration.
     */
    getCollection: builder.query<Collection, string>({
      providesTags: (_0, _1, id) => [{ type: Endpoint.Collections, id }],
      query: (id) => {
        return `${Endpoint.Collections}/${id}`
      },
    }),

    /**
     * Get Collections query configuration
     */
    getCollections: builder.query<
      { items: Collection[]; totalCount: number },
      CollectionFilters
    >({
      query: (filters) => {
        return `${Endpoint.Collections}${filterBuilder.createFilters(
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
              ...result.items.map(
                ({ id }) => ({ type: Endpoint.Collections, id } as const)
              ),
              { type: Endpoint.Collections, id: 'LIST' },
            ]
          : // An error occured, but we still want to refetch this query when the tag is invalidated.
            [{ type: Endpoint.Collections, id: 'LIST' }],
    }),

    /**
     * Add a Collection mutation
     */
    addCollection: builder.mutation<Collection, ICollectionForm>({
      query: (body: ICollectionForm) => ({
        url: Endpoint.Collections,
        method: 'POST',
        body,
      }),
      // Invalidates all Collection-type queries providing the LIST id - after all, depending of the sort order
      // that newly created Collection could show up in any lists.
      invalidatesTags: [{ type: Endpoint.Collections, id: 'LIST' }],
    }),

    /**
     * Update Collection mutation
     */
    updateCollection: builder.mutation<
      Collection,
      { id: string; body: ICollectionForm }
    >({
      query: ({ id, body }) => ({
        url: `${Endpoint.Collections}/${id}`,
        method: 'PUT',
        body,
      }),
      // Invalidates all queries that subscribe to this Collection `id` only.
      // In this case, `getCollection` will be re-run. `getCollections` *might*  rerun, if this id was under its results.
      invalidatesTags: (result, _1, { id }) =>
        result ? [{ type: Endpoint.Collections, id }] : [],
    }),
  }),
})

export const {
  useGetCollectionsQuery,
  useGetCollectionQuery,
  useAddCollectionMutation,
  useUpdateCollectionMutation,
} = collectionsApi
