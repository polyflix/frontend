import { Visibility } from '@core/models/content.model'
import { PaginationFilter } from '@types_/filters.type'

export interface QuizzFilters extends PaginationFilter {
  keepHighestScore?: boolean
  visibility?: Visibility
  draft?: boolean
  userId?: string
  isDone?: boolean
  solved?: boolean
}

export interface QuizzAttemptFilters extends PaginationFilter {
  userId?: string
}
