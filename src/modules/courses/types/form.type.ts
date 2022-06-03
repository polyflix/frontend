import { Visibility } from '@core/models/content.model'

export interface ICourseForm {
  name: string
  draft: boolean
  visibility: Visibility
  description: string
  content: string
  collections?: string[]
  modules?: string[]
}
