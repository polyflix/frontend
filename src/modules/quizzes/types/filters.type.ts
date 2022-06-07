import { Visibility } from '@core/models/content.model'
import { QueryFilter } from '@core/types/nestjsx-crud.type'

export interface QuizzFilters extends QueryFilter {
  draft?: boolean
  isDone?: boolean
  keepHighestScore?: boolean
  name?: string
  userId?: string
  visibility?: Visibility
}

export interface QuizzAttemptFilters extends QueryFilter {
  'user.id'?: string
}
