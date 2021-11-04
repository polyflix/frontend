import { ContentModel } from '@core/models/content.model'

import { Video } from '@videos/models/video.model'

import { User } from '@users/models/user.model'

import { AccessPassword } from '../types/form.type'

export interface Collection extends ContentModel {
  description: string
  title: string
  publisherId: string
  publishedBy?: User

  slug: string

  videos: Video[]
  passwords: AccessPassword[]
  //   tags: Tag[]
}
