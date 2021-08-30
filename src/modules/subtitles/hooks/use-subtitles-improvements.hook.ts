import { useFetch } from '../../common/hooks/useFetch.hook'
import { ISubtitleImprovementFilter } from '../filters/subtitle-improvement.filter'
import { SubtitleImprovement } from '../models/subtitle-improvement.model'
import { SubtitleImprovementService } from '../services/subtitle-improvement.service'

export const useSubtitlesImprovements = (
  filters: ISubtitleImprovementFilter,
  onStart?: () => any,
  onComplete?: () => any
) => {
  return useFetch<SubtitleImprovement[], SubtitleImprovementService>(
    SubtitleImprovementService,
    'findAll',
    [filters],
    {
      onComplete,
      onStart,
    }
  )
}
