import { QueryFilter as NjxQueryFilter } from '@nestjsx/crud-request'

import { Visibility } from '@core/models/content.model'
import { QueryFilter } from '@core/types/nestjsx-crud.type'

export interface LinkFilters extends QueryFilter {
  'element.visibility'?: Visibility
  'element.draft'?: boolean
  'user.id'?: string
  name?: NjxQueryFilter
}
