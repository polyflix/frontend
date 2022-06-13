import { Visibility } from '@core/models/content.model'

export interface ICursusForm {
  title: string
  draft: boolean
  visibility: Visibility
  description: string
  courses?: string[]
}
