import { BaseModel } from './base.model'

export enum Visibility {
  PUBLIC = 'public',
  PROTECTED = 'protected',
  PRIVATE = 'private',
}

export interface ContentModel extends BaseModel {
  /**
   * The visibility of the resource
   */
  visibility?: Visibility
  /**
   * True if the resource is in draft mode, false otherwise
   */
  draft?: boolean
}
