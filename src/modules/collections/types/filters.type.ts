import { Visibility } from '@core/models/content.model'
import { PaginationFilter } from '@core/types/filters.type'

export interface CollectionFilters extends PaginationFilter {
  visibility?: Visibility
  draft?: boolean
  name?: string
  userId?: string
  order?: string
  slug?: string
}
