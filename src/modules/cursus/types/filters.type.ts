import { Visibility } from '@core/models/content.model'
import { PaginationFilter } from '@core/types/filters.type'

export interface CursusFilters extends PaginationFilter {
  visibility?: Visibility
  draft?: boolean
  userId?: string
  title?: string
  order?: string
  slug?: string
}
