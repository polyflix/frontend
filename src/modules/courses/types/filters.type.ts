import { Visibility } from '@core/models/content.model'
import { PaginationFilter } from '@core/types/filters.type'

export interface CoursesFilters extends PaginationFilter {
  visibility?: Visibility
  draft?: boolean
  userId?: string
  name?: string
  order?: string
  slug?: string
}
