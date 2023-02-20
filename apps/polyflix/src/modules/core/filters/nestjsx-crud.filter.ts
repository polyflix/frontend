import {
  CondOperator,
  QueryJoin,
  QuerySort,
  RequestQueryBuilder,
} from '@nestjsx/crud-request'
import { isUndefined } from 'lodash'

import { Injectable } from '@polyflix/di'

import { QueryFilter } from '@types_/nestjsx-crud.type'

import { CanFilter } from './abstract.filter'

@Injectable()
export class CrudFilters<T extends QueryFilter> implements CanFilter<T> {
  /**
   * Build the URL Query with the RequestQueryBuilder of @nestjsx/crud-request.
   * @see https://github.com/nestjsx/crud/wiki/Requests#frontend-usage
   * @param filters the filters to apply
   * @returns {string} the encoded URL query
   */
  public createFilters(filters: T | Partial<T>): string {
    const { page, limit, offset, join, search, sort, ...entityFilters } =
      filters

    const qb = RequestQueryBuilder.create({
      page,
      limit,
      offset,
      search,
      sort: sort?.filter((sorted) => !isUndefined(sorted.order)),
      join: this.buildQueryJoinArray(join || []),
      filter: Object.entries(entityFilters)
        .filter(([, value]) => value !== undefined)
        .map(([field, value]) => ({
          operator: CondOperator.EQUALS,
          field,
          value,
        })),
    })

    return `?${qb.query()}`
  }

  private buildQueryJoinArray(joins?: (string | QueryJoin)[]): QueryJoin[] {
    if (!joins) return []
    return joins.map((field) => {
      if (typeof field === 'string') {
        return { field }
      }
      return field
    })
  }

  static buildSort(
    property: string,
    sortedItems: QuerySort[] = [],
    callback?: (sorted: QuerySort[]) => void
  ) {
    return (querySort: QuerySort) => {
      let sort: QuerySort[] | undefined
      // If the sorted property is already sorted by another operator, we replace it in place
      const item = sortedItems.find(({ field }) => field === property)
      if (item) {
        const idx = sortedItems.indexOf(item)
        sortedItems[idx] = querySort
        sort = sortedItems
      } else sort = [...sortedItems, querySort]

      if (callback) callback(sort)
    }
  }
}
