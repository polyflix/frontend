export interface BaseModel {
  /**
   * The id of the resource
   */
  id: string
  /**
   * The creation date of the resource
   */
  createdAt: string
  /**
   * The last update date of the resource
   */
  updatedAt: string
  /**
   * The version of the resource
   */
  __v: number
}
