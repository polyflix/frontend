import { useFetch } from '../../common/hooks/useFetch.hook'
import { ICourseFilter } from '../filters/course.filter'
import { CourseService } from '../services'
import { CoursesWithPagination } from '../types'

export const useCourses = (
  filters: ICourseFilter,
  onCourseLoaded?: (totalItems: number) => any
) => {
  return useFetch<CoursesWithPagination, CourseService>(
    CourseService,
    'getCourses',
    [filters],
    {
      onComplete: onCourseLoaded
        ? ({ totalCount }) => onCourseLoaded(totalCount)
        : undefined,
      deps: [filters.page, filters.order, filters.pageSize],
    }
  )
}
