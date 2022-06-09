import { Visibility } from '@core/models/content.model'
import { PaginationFilter } from '@core/types/filters.type'

export interface QuizzFilters extends PaginationFilter {
  keepHighestScore?: boolean
  visibility?: Visibility
  draft?: boolean
  userId?: string
  isDone?: boolean
}

export interface QuizzAttemptFilters extends PaginationFilter {
  userId?: string
}
