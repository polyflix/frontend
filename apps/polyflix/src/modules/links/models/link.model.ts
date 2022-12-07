import { ContentModel } from '@core/models/content.model'

import { User } from '@users/models/user.model'

export interface Link extends ContentModel {
  url: string
  user?: Partial<User>
}
