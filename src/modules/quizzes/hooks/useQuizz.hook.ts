import { isUndefined } from 'lodash'

import { useFetch } from '../../common/hooks/useFetch.hook'
import { QuizzFilters } from '../filters/quizz.filter'
import { Quizz } from '../models/quizz.model'
import { QuizzService } from '../services/quizz.service'

export const useQuizz = (id: string, filters?: QuizzFilters) => {
  return useFetch<Quizz, QuizzService>(
    QuizzService,
    'getQuizz',
    [id, filters],
    { if: !isUndefined(id) }
  )
}
