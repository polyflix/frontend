import { Container } from '@polyflix/di'

import { Endpoint } from '@constants/endpoint.constant'
import { CrudFilters } from '@core/filters/nestjsx-crud.filter'
import { Element } from '@core/models/element.model'
import { api } from '@services/api.service'
import { Pagination } from '@types_/nestjsx-crud.type'

import { Link } from '@links/models/link.model'
import { LinkFilters } from '@links/types/filters.type'
import { ILinkForm } from '@links/types/form.type'

// Get the filter builder from our DI system
const filterBuilder = Container.get<CrudFilters<LinkFilters>>(CrudFilters)

// Inject Links endpoints to the core API
export const LinksApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get Link by id query configuration.
     */
    getLink: builder.query<
      Element<Link>,
      { id: string; filters?: LinkFilters }
    >({
      providesTags: (_0, _1, { id }) => [{ type: Endpoint.Links, id }],
      query: ({ id, filters }) => {
        return `${Endpoint.Links}/${id}${filterBuilder.createFilters(
          filters || {}
        )}`
      },
    }),

    /**
     * Get Links query configuration
     */
    getLinks: builder.query<Pagination<Element<Link>>, LinkFilters>({
      query: (filters?: LinkFilters) => {
        return `${Endpoint.Links}${filterBuilder.createFilters(filters || {})}`
      },
      // Provides a list of Links by id.
      // If any mutation is executed that invalidate any of these tags, this query will re-run to be always up-to-date.
      // The `LIST` id is a "virtual id" we just made up to be able to invalidate this query specifically if a new `Link` element was added.
      providesTags: (result) =>
        // Is result available ?
        result
          ? [
              ...result.data.map(
                ({ id }) => ({ type: Endpoint.Links, id } as const)
              ),
              { type: Endpoint.Links, id: 'LIST' },
            ]
          : // An error occured, but we still want to refetch this query when the tag is invalidated.
            [{ type: Endpoint.Links, id: 'LIST' }],
    }),

    /**
     * Add a Link mutation
     */
    addLink: builder.mutation<Element<Link>, ILinkForm>({
      query: (body: ILinkForm) => ({
        url: Endpoint.Links,
        method: 'POST',
        body,
      }),
      // Invalidates all Link-type queries providing the LIST id - after all, depending of the sort order
      // that newly created Link could show up in any lists.
      invalidatesTags: [{ type: Endpoint.Links, id: 'LIST' }],
    }),

    /**
     * Update Link mutation
     */
    updateLink: builder.mutation<
      Element<Link>,
      { id: string; body: ILinkForm }
    >({
      query: ({ id, body }) => ({
        url: `${Endpoint.Links}/${id}`,
        method: 'PUT',
        body,
      }),
      // Invalidates all queries that subscribe to this Link `id` only.
      // In this case, `getLink` will be re-run. `getLinks` *might*  rerun, if this id was under its results.
      invalidatesTags: (result, _1, { id }) =>
        result ? [{ type: Endpoint.Links, id }] : [],
    }),

    /**
     * Delete Link mutation
     */
    deleteLink: builder.mutation<Element<Link>, { id: string }>({
      query: ({ id }) => ({
        url: `${Endpoint.Links}/${id}`,
        method: 'DELETE',
      }),
      // Invalidates all queries that subscribe to this Link `id` only.
      // In this case, `getLink` will be re-run. `getLinks` *might*  rerun, if this id was under its results.
      invalidatesTags: (_, _1, { id }) => [{ type: Endpoint.Links, id }],
    }),
  }),
})

export const {
  useGetLinksQuery,
  useGetLinkQuery,
  useAddLinkMutation,
  useUpdateLinkMutation,
  useDeleteLinkMutation,
} = LinksApi
