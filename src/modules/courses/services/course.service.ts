import { Course } from '@courses/models/course.model'
import { CoursesFilters } from '@courses/types/filters.type'
import { ICourseForm } from '@courses/types/form.type'

import { Container } from '@polyflix/di'

import { Endpoint } from '@core/constants/endpoint.constant'
import { CrudFilters } from '@core/filters/nestjsx-crud.filter'
import { api } from '@core/services/api.service'
import { Pagination } from '@core/types/nestjsx-crud.type'

// Get the filter builder from our DI system
const filterBuilder = Container.get<CrudFilters<CoursesFilters>>(CrudFilters)

// Inject Courses endpoints to the core API
export const CoursesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get Course by id query configuration.
     */
    getCourse: builder.query<Course, { id: string; filters?: CoursesFilters }>({
      providesTags: (_0, _1, { id }) => [{ type: Endpoint.Courses, id }],
      query: ({ id, filters }) => {
        return `${Endpoint.Courses}/${id}${filterBuilder.createFilters(
          filters || {}
        )}`
      },
    }),

    /**
     * Get Courses query configuration
     */
    getCourses: builder.query<Pagination<Course>, CoursesFilters>({
      query: (filters?: CoursesFilters) => {
        return `${Endpoint.Courses}${filterBuilder.createFilters(
          filters || {}
        )}`
      },

      // Provides a list of Courses by id.
      // If any mutation is executed that invalidate any of these tags, this query will re-run to be always up-to-date.
      // The `LIST` id is a "virtual id" we just made up to be able to invalidate this query specifically if a new `Course` element was added.
      providesTags: (result) =>
        // Is result available ?
        result
          ? [
              ...result.data.map(
                ({ id }) => ({ type: Endpoint.Courses, id } as const)
              ),
              { type: Endpoint.Courses, id: 'LIST' },
            ]
          : // An error occured, but we still want to refetch this query when the tag is invalidated.
            [{ type: Endpoint.Courses, id: 'LIST' }],
    }),

    /**
     * Add a Course mutation
     */
    addCourse: builder.mutation<Course, ICourseForm>({
      query: (body: ICourseForm) => ({
        url: Endpoint.Courses,
        method: 'POST',
        body,
      }),
      // Invalidates all Course-type queries providing the LIST id - after all, depending of the sort order
      // that newly created Course could show up in any lists.
      invalidatesTags: [{ type: Endpoint.Courses, id: 'LIST' }],
    }),

    /**
     * Update Course mutation
     */
    updateCourse: builder.mutation<Course, { id: string; body: ICourseForm }>({
      query: ({ id, body }) => ({
        url: `${Endpoint.Courses}/${id}`,
        method: 'PUT',
        body,
      }),
      // Invalidates all queries that subscribe to this Course `id` only.
      // In this case, `getCourse` will be re-run. `getCourses` *might*  rerun, if this id was under its results.
      invalidatesTags: (result, _1, { id }) =>
        result ? [{ type: Endpoint.Courses, id }] : [],
    }),

    /**
     * Delete Course mutation
     */
    deleteCourse: builder.mutation<Course, { id: string }>({
      query: ({ id }) => ({
        url: `${Endpoint.Courses}/${id}`,
        method: 'DELETE',
      }),
      // Invalidates all queries that subscribe to this Course `id` only.
      // In this case, `getCourse` will be re-run. `getCourses` *might*  rerun, if this id was under its results.
      invalidatesTags: (_, _1, { id }) => [{ type: Endpoint.Courses, id }],
    }),
  }),
})

export const {
  useGetCoursesQuery,
  useGetCourseQuery,
  useAddCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = CoursesApi