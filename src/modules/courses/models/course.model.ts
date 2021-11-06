import { ContentModel } from '@core/models/content.model'

import { User } from '@users/models/user.model'

export interface Course extends ContentModel {
  name: string
  user?: Partial<User>
}
