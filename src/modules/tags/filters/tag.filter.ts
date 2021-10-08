import { Injectable } from '@polyflix/di'

import { AbstractFilter } from '../../common/filters/abtract.filter'
import { PaginationFilter } from '../../common/types/filter.type'

export interface ITagFilter extends PaginationFilter {
  showAll?: boolean
}

@Injectable()
export class TagFilter extends AbstractFilter<ITagFilter> {
  public buildFilters(filters: ITagFilter | Partial<ITagFilter>): string {
    this.clear()
    Object.entries(filters).forEach(([key, value]) => {
      this.queryBuilder.set(key, value)
    })
    return this.queryBuilder.toString()
  }
}
