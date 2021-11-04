import { Visibility } from '@core/models/content.model'
import { PaginationFilter } from '@core/types/filters.type'

export interface CollectionFilters extends PaginationFilter {
  order?: string
  slug?: string
  title?: string
  publisherId?: string
  exact?: boolean
  tags?: string
  visibility?: Visibility
  draft?: boolean
}
