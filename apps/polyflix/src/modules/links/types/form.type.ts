import { Visibility } from '@types_/resources/content.type'

export interface ILinkForm {
  name: string
  description: string
  draft: boolean
  visibility: Visibility
  url: string
}
