import { QueryJoin, QuerySort, SCondition } from '@nestjsx/crud-request'

/**
 * This file export some types required to interact with CRUD based on @nestjsx/crud micro-framework.
 * @see https://github.com/nestjsx/crud
 * @see https://github.com/nestjsx/crud/wiki/Requests
 */

/**
 * Paginated response of a specific type.
 */
export interface Pagination<T> {
  data: T[]
  count: number
  page: number
  pageCount: number
  total: number
}

/**
 * Interface used to join an entity or a collection of entity with their relations.
 * @see https://github.com/nestjsx/crud/wiki/Requests#join
 */
export interface JoinFilter {
  join?: (string | QueryJoin)[]
}

export interface SortFilter {
  sort?: QuerySort[]
}

export interface SearchFilter {
  search?: SCondition
}

/**
 * Filters for CRUD pagination.
 * @see https://github.com/nestjsx/crud/wiki/Requests
 */
export interface PaginationFilter {
  page?: number
  limit?: number
  offset?: number
}

export type QueryFilter = JoinFilter &
  PaginationFilter &
  SearchFilter &
  SortFilter
