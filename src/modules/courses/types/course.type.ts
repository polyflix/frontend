import { ICollection } from '../../collections/types'
import { IPublisher } from '../../common/types'
import { Visibility } from '../../common/types/crud.type'
import { AlertType } from '../../ui/components/Alert/Alert.component'
import { Course } from '../models'

export interface ICourseForm {
  title: string
  content: string
  collections: CollectionLite[]
  draft: boolean
  visibility: Visibility
}

type CollectionLite = {
  id: string
}

export type CourseState<T> = {
  isLoading: boolean
  data: T | null
  alert: { type: AlertType; message: string } | null
  refresh: () => void
}

export type CoursesWithPagination = {
  totalCount: number
  items: Course[]
}

export interface ICourse {
  content: string
  id: string
  title: string
  publisherId: string
  publishedBy: IPublisher | null
  collections: ICollection[]
  createdAt: string
  updatedAt: string
  slug: string
  draft: boolean
  visibility: Visibility
}
