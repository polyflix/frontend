import { useFetch } from '../../common/hooks/useFetch.hook'
import { IPathFilter } from '../filters/path.filter'
import { PathService } from '../services'
import { PathsWithPagination } from '../types'

export const usePaths = (
  filters: IPathFilter,
  onCollectionLoaded?: (totalItems: number) => any
) => {
  return useFetch<PathsWithPagination, PathService>(
    PathService,
    'getPaths',
    [filters],
    {
      onComplete: onCollectionLoaded
        ? ({ totalCount }) => onCollectionLoaded(totalCount)
        : undefined,
      deps: [filters.page, filters.order, filters.pageSize],
    }
  )
}
