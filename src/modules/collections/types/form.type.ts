import { Visibility } from '@core/models/content.model'

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

type TagLite = {
  id: string
}
