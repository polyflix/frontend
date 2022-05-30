export interface IWatchMetadata {
  watchedSeconds: number
  watchedPercent: number
  isWatched: boolean
  isLiked: boolean
  updatedAt: string
  createdAt: string
}

export type UpsertUserVideoMeta = {
  videoSlug: string
  watchedSeconds: number
  watchedPercent: number
  isWatched?: boolean
}
