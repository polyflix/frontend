import { createApi } from '@reduxjs/toolkit/dist/query/react'

import { Container } from '@polyflix/di'

import { Endpoint } from '@constants/endpoint.constant'
import { RestCrudFilters } from '@core/filters/rest-crud.filter'
import { fetchWithRefresh } from '@services/api.service'
import { ApiVersion, Pagination } from '@types_/http.type'

import {
  Certificate,
  Certification,
} from '@certifications/models/certification.model'
import { CertificationFilters } from '@certifications/types/filters.type'
import {
  ICertificateForm,
  ICertificationForm,
} from '@certifications/types/form.type'

// Get the filter builder from our DI system
const filterBuilder =
  Container.get<RestCrudFilters<CertificationFilters>>(RestCrudFilters)

// Inject certifications endpoints to the core API
export const certificationsApi = createApi({
  reducerPath: 'api/certifications',
  baseQuery: fetchWithRefresh(ApiVersion.V2),
  tagTypes: [Endpoint.Certifications],
  endpoints: (builder) => ({
    /**
     * Get certification
     */
    getCertification: builder.query<
      Certification,
      { id: string; filters?: CertificationFilters }
    >({
      providesTags: (_0, _1, { id }) => [{ type: Endpoint.Certifications, id }],
      query: ({ id, filters }) => {
        return `${Endpoint.Certifications}/${id}${filterBuilder.createFilters(
          filters || {}
        )}`
      },
    }),

    /**
     * Get a current user certificate
     */
    getMyCertificate: builder.query<
      Pagination<Certificate>,
      CertificationFilters
    >({
      query: (filters?: CertificationFilters) => {
        return `${
          Endpoint.Certifications
        }/certificate/${filterBuilder.createFilters(filters || {})}`
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(
                ({ id }) =>
                  ({
                    type: Endpoint.Certifications,
                    id: id,
                  } as const)
              ),
              { type: Endpoint.Certifications, id: 'LIST' },
            ]
          : // An error occured, but we still want to refetch this query when the tag is invalidated.
            [{ type: Endpoint.Certifications, id: 'LIST' }],
    }),

    /**
     * Get a certificate from a certification by certificate id
     */
    getCertificate: builder.query<Certificate, { id: string }>({
      providesTags: (_0, _1, { id }) => [{ type: Endpoint.Certifications, id }],
      query: ({ id }) => {
        return `${Endpoint.Certifications}/certificate/${id}`
      },
    }),

    /**
     * Get a list of certificate by certification id
     */
    getCertificatesByCertification: builder.query<
      Pagination<Certificate>,
      { id: string }
    >({
      providesTags: (_0, _1, { id }) => [{ type: Endpoint.Certifications, id }],
      query: ({ id }) => {
        return `${Endpoint.Certifications}/${id}/certificate`
      },
    }),

    /**
     * Add a Certificate mutation
     */
    addCertificate: builder.mutation<ICertificateForm, ICertificateForm>({
      query: (body: ICertificateForm) => ({
        url: Endpoint.Certifications + '/certificate',
        method: 'POST',
        body,
      }),
      // Invalidates all Certification-type queries providing the LIST id - after all, depending of the sort order
      // that newly created Certification could show up in any lists.
      invalidatesTags: [{ type: Endpoint.Certifications, id: 'LIST' }],
    }),

    /**
     * Get Certifications query configuration
     */
    getCertifications: builder.query<
      Pagination<Certification>,
      CertificationFilters
    >({
      query: (filters?: CertificationFilters) => {
        return `${Endpoint.Certifications}${filterBuilder.createFilters(
          filters || {}
        )}`
      },
      // Provides a list of Certifications by id.
      // If any mutation is executed that invalidate any of these tags, this query will re-run to be always up-to-date.
      // The `LIST` id is a "virtual id" we just made up to be able to invalidate this query specifically if a new `Certification` element was added.
      providesTags: (result) =>
        // Is result available ?
        result
          ? [
              ...result.data.map(
                ({ id }) =>
                  ({
                    type: Endpoint.Certifications,
                    id: id,
                  } as const)
              ),
              { type: Endpoint.Certifications, id: 'LIST' },
            ]
          : // An error occured, but we still want to refetch this query when the tag is invalidated.
            [{ type: Endpoint.Certifications, id: 'LIST' }],
    }),

    /**
     * Add a Certification mutation
     */
    addCertification: builder.mutation<Certification, ICertificationForm>({
      query: (body: ICertificationForm) => ({
        url: Endpoint.Certifications,
        method: 'POST',
        body,
      }),
      // Invalidates all Certification-type queries providing the LIST id - after all, depending of the sort order
      // that newly created Certification could show up in any lists.
      invalidatesTags: [{ type: Endpoint.Certifications, id: 'LIST' }],
    }),

    /**
     * Update Certification mutation
     */
    updateCertification: builder.mutation<
      Certification,
      { id: string; body: ICertificationForm }
    >({
      query: ({ id, body }) => ({
        url: `${Endpoint.Certifications}/${id}`,
        method: 'PUT',
        body,
      }),
      // Invalidates all queries that subscribe to this Certification `id` only.
      // In this case, `getCertification` will be re-run. `getCertifications` *might*  rerun, if this id was under its results.
      invalidatesTags: (result, _1, { id }) =>
        result ? [{ type: Endpoint.Certifications, id }] : [],
    }),

    /**
     * Delete Certification mutation
     */
    deleteCertification: builder.mutation<Certification, { id: string }>({
      query: ({ id }) => ({
        url: `${Endpoint.Certifications}/${id}`,
        method: 'DELETE',
      }),
      // Invalidates all queries that subscribe to this Certification `id` only.
      // In this case, `getCertification` will be re-run. `getCertifications` *might*  rerun, if this id was under its results.
      invalidatesTags: (_, _1, { id }) => [
        { type: Endpoint.Certifications, id },
      ],
    }),
  }),
})

export const {
  useGetCertificationsQuery,
  useGetCertificateQuery,
  useGetMyCertificateQuery,
  useGetCertificatesByCertificationQuery,
  useGetCertificationQuery,
  useAddCertificationMutation,
  useUpdateCertificationMutation,
  useDeleteCertificationMutation,
  useAddCertificateMutation,
} = certificationsApi
