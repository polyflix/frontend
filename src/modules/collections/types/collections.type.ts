import { IPublisher } from '../../common/types'
import { Visibility } from '../../common/types/crud.type'
import { Tag } from '../../tags/models/tag.model'
import { TagLite } from '../../tags/types/tag.type'
import { AlertType } from '../../ui/components/Alert/Alert.component'
import { IVideo } from '../../videos/types/videos.type'
import { Collection } from '../models/collections.model'

export interface ICollectionForm {
  title: string
  description: string
  videos: VideoLite[]
  draft: boolean
  visibility: Visibility
  passwords: AccessPassword[]
  tags: TagLite[]
}

export type AccessPassword = {
  name: string
  password: string
  expiration: string
  collectionId: string
}

type VideoLite = {
  id: string
}

export type CollectionState<T> = {
  isLoading: boolean
  data: T | null
  alert: { type: AlertType; message: string } | null
  refresh: () => void
}

export type CollectionsWithPagination = {
  totalCount: number
  items: Collection[]
}

export type CollectionParams = {
  page?: number

  pageSize?: number

  order?: string

  slug?: string

  title?: string

  publisherId?: string

  joinWithPublisher?: boolean

  password?: string

  draft?: boolean

  visibility?: Visibility

  tags?: string
}

export interface ICollection {
  id: string
  description: string
  title: string
  publisherId: string
  publishedBy: IPublisher | null
  createdAt: string
  updatedAt: string
  slug: string
  draft: boolean
  visibility: Visibility
  videos: IVideo[]
  passwords: AccessPassword[]
  tags: Tag[]
}
