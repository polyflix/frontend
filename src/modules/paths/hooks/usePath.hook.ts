import { useFetch } from '../../common/hooks/useFetch.hook'
import { Path } from '../models'
import { PathService } from '../services'

export const usePath = (slug: string) => {
  return useFetch<Path, PathService>(PathService, 'getPathBySlug', [slug])
}
