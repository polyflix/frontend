import { useFetch } from '../../common/hooks/useFetch.hook'
import { Course } from '../models'
import { CourseService } from '../services'

export const useCourse = (slug: string) => {
  return useFetch<Course, CourseService>(CourseService, 'getCourseBySlug', [
    slug,
  ])
}
