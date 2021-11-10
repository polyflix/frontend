import { Pagination } from '@mui/material'
import { useHistory } from 'react-router-dom'

import { QuizzFilters } from '@quizzes/types/filters.type'

import { VideoFilters } from '@videos/types/filters.type'

import { LinkFilters } from '@links/types/filters.type'

import { CollectionFilters } from '@collections/types/filters.type'

import { CoursesFilters } from '@courses/types/filters.type'

type PaginationProps = {
  filters:
    | VideoFilters
    | QuizzFilters
    | CollectionFilters
    | CoursesFilters
    | LinkFilters
  setFilters: ({}: any) => void
  pageCount: number
}

export const PaginationSynced = ({
  filters,
  setFilters,
  pageCount,
}: PaginationProps) => {
  const history = useHistory()

  /** Set page on url and update filter allowing rtkq to refetch with new filters */
  function setPage(page: number) {
    // Should set a page that doesn't exist
    if (page < 1 || page > pageCount) {
      return
    }

    history.push({
      pathname: history.location.pathname,
      search: '?page=' + page,
    })

    setFilters({ ...filters, page })
  }

  return (
    <Pagination
      onChange={(e, page) => setPage(page)}
      count={pageCount || 1}
      defaultPage={filters.page}
      shape="rounded"
      showFirstButton
      showLastButton
    />
  )
}
