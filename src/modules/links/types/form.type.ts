import { Visibility } from '@core/models/content.model'

export interface ILinkForm {
  name: string
  description: string
  draft: boolean
  visibility: Visibility
  url: string
}
