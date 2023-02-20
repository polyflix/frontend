import { Visibility } from '@types_/resources/content.type'
import { PaginationFilter } from '@types_/filters.type'

export interface CollectionFilters extends PaginationFilter {
  visibility?: Visibility
  draft?: boolean
  name?: string
  userId?: string
  order?: string
  slug?: string
}
