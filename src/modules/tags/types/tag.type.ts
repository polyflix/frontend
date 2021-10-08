export interface ITag {
  id: string
  label: string
  isReviewed: boolean
}

export interface ITagForm {
  label: string
  isReviewed: boolean
}

export type TagLite = {
  id: string
}
