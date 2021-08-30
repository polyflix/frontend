import { IPublisher } from '../../common/types'
import { AlertType } from '../../ui/components/Alert/Alert.component'
import { Path } from '../models/path.model'
import { IOrderedCourse } from './orderedCourse.type'

export interface IPathForm {
  title: string
  description: string
  courses: Omit<IOrderedCourse, 'id'>[]
}

export type PathState<T> = {
  isLoading: boolean
  data: T | null
  alert: { type: AlertType; message: string } | null
  triggerReload: () => void
}

export type PathsWithPagination = {
  totalCount: number
  items: Path[]
}

export interface IPath {
  id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
  slug: string
  publisherId: string
  publishedBy: IPublisher | null
  courses: IOrderedCourse[]
}
