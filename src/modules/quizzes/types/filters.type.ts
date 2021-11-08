import { QueryFilter as NjxQueryFilter } from '@nestjsx/crud-request'

import { Visibility } from '@core/models/content.model'
import { QueryFilter } from '@core/types/nestjsx-crud.type'

export interface QuizzFilters extends QueryFilter {
  keepHighestScore?: boolean
  'element.visibility'?: Visibility
  'element.draft'?: boolean
  'element.user.id'?: string
  'attempts.user'?: string
  name?: NjxQueryFilter
}

export interface QuizzAttemptFilters extends QueryFilter {
  'user.id'?: string
}
