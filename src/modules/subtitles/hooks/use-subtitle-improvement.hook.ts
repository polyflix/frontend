import { useFetch } from '../../common/hooks/useFetch.hook'
import { SubtitleImprovement } from '../models/subtitle-improvement.model'
import { SubtitleImprovementService } from '../services/subtitle-improvement.service'

export const useSubtitleImprovement = (slug: string) => {
  return useFetch<SubtitleImprovement, SubtitleImprovementService>(
    SubtitleImprovementService,
    'get',
    [slug]
  )
}
