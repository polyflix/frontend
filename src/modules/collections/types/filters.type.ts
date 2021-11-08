import { QueryFilter as NjxQueryFilter } from '@nestjsx/crud-request'

import { Visibility } from '@core/models/content.model'
import { QueryFilter } from '@core/types/nestjsx-crud.type'

export interface CollectionFilters extends QueryFilter {
  visibility?: Visibility
  draft?: boolean
  name?: NjxQueryFilter
  'user.id'?: string
}
