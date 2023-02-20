import { Visibility } from '@types_/resources/content.type'
import { PaginationFilter } from '@types_/filters.type'

export interface CoursesFilters extends PaginationFilter {
  visibility?: Visibility
  draft?: boolean
  userId?: string
  name?: string
  order?: string
  slug?: string
}
