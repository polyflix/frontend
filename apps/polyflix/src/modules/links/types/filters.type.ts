import { QueryFilter as NjxQueryFilter } from '@nestjsx/crud-request'

import { Visibility } from '@types_/resources/content.type'
import { QueryFilter } from '@types_/nestjsx-crud.type'

export interface LinkFilters extends QueryFilter {
  'element.visibility'?: Visibility
  'element.draft'?: boolean
  'element.name'?: string
  'element.user.id'?: string
  name?: NjxQueryFilter
}
