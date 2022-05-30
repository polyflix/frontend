export interface WatchMetadata {
  watchedSeconds: number
  watchedPercent: number
  isWatched: boolean
  isLiked: boolean
  updatedAt: string
  createdAt: string
}

export interface Watchtime {
  videoSlug: string
  userId?: string
  watchedSeconds: number
  watchedPercent: number
  isWatched: boolean
}
