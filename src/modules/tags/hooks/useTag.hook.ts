import { useFetch } from '../../common/hooks/useFetch.hook'
import { ITagFilter } from '../filters/tag.filter'
import { Tag } from '../models/tag.model'
import { TagService } from '../services/tag.service'

export const useTags = (filters: ITagFilter) => {
  return useFetch<Tag[], TagService>(TagService, 'getTags', [filters])
}
