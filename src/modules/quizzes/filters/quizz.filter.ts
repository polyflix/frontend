import { QueryFilter as NjxQueryFilter } from '@nestjsx/crud-request'

import { QueryFilter, Visibility } from '../../common/types/crud.type'

export interface QuizzFilters extends QueryFilter {
  visibility?: Visibility
  keepHighestScore?: boolean
  draft?: boolean
  'user.id'?: string
  'attempts.user'?: string
  name?: NjxQueryFilter
}

export interface QuizzAttemptFilters extends QueryFilter {
  'user.id'?: string
}
