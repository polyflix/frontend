import { Visibility } from '@core/models/content.model'

export interface PaginationFilter {
  page?: number
  pageSize?: number
}
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
