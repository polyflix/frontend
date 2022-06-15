import { Visibility } from '@core/models/content.model'

import { Collection } from '@collections/models/collection.model'

export interface ICourseForm {
  name: string
  draft: boolean
  visibility: Visibility
  description: string
  content: string
  modules: Collection[]
}
