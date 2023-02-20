import { Visibility } from '@types_/resources/content.type'

import { Collection } from '@collections/models/collection.model'

export interface ICourseForm {
  name: string
  draft: boolean
  visibility: Visibility
  description: string
  content: string
  modules: Collection[]
}
