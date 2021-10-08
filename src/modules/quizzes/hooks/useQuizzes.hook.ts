import { useFetch } from '../../common/hooks/useFetch.hook'
import { Pagination } from '../../common/types/crud.type'
import { QuizzFilters } from '../filters/quizz.filter'
import { Quizz } from '../models/quizz.model'
import { QuizzService } from '../services/quizz.service'

export const useQuizzes = (
  filters: QuizzFilters,
  onCollectionLoaded?: (totalItems: number) => any
) => {
  return useFetch<Pagination<Quizz>, QuizzService>(
    QuizzService,
    'getQuizzes',
    [filters],
    {
      onComplete: onCollectionLoaded
        ? ({ total }) => onCollectionLoaded(total)
        : undefined,
      deps: [filters.page, filters.limit],
    }
  )
}
