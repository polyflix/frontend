import { ContentModel, Visibility } from '@core/models/content.model'

import { User } from '@users/models/user.model'

export interface Link extends ContentModel {
  name: string
  description: string
  url: string
  draft: boolean
  visibility: Visibility
  user?: Partial<User>
}
