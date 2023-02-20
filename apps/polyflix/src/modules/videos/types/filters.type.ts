import { Visibility } from '@types_/resources/content.type'
import { PaginationFilter } from '@types_/filters.type'

export interface VideoFilters extends PaginationFilter {
  order?: string
  slug?: string
  title?: string
  authorId?: string
  isPublished?: boolean
  isPublic?: boolean
  isWatched?: boolean
  isWatching?: boolean
  exact?: boolean
  tags?: string
  visibility?: Visibility
  draft?: boolean
}
