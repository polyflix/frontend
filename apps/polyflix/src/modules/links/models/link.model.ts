import { ContentModel } from '@types_/resources/content.type'

import { User } from '@types_/user.type'

export interface Link extends ContentModel {
  url: string
  user?: Partial<User>
}
