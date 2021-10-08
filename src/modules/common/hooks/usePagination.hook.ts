import { useState } from 'react'

import {
  ItemsPerPage,
  Pagination,
  PaginationMode,
} from '../types/pagination.type'

export const DEFAULT_PAGE = 1
const DEFAULT_LIMIT: ItemsPerPage = 20

/**
 * Custom hook for handling pagination states.
 * @returns {Pagination} the pagination
 */
export const usePagination = (): Pagination => {
  const [finalPage, setFinalPage] = useState<number>(DEFAULT_PAGE)
  const [page, setPage] = useState<number>(DEFAULT_PAGE)
  const [limit, setLimit] = useState<ItemsPerPage>(DEFAULT_LIMIT)
  const goToPage = (mode: PaginationMode): void => {
    let p: number
    switch (mode) {
      case 'first':
        p = DEFAULT_PAGE
        break
      case 'last':
        p = finalPage
        break
      case 'next':
        p = page + 1 <= finalPage ? page + 1 : page
        break
      case 'previous':
        p = page - 1 >= DEFAULT_PAGE ? page - 1 : page
        break
      default:
        p = DEFAULT_PAGE
        break
    }
    if (page !== p) setPage(p)

    window.scrollTo(0, 0)
  }

  return {
    page,
    limit,
    to: goToPage,
    setFinalPage,
    setLimit,
  }
}
