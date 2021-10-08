export type StatViewQuery = {
  viewsCount: number
  likesCount: number
  watchedPercentMean: number
  createdAt: string
}

export type StatView = {
  viewsCount: number
  likesCount: number
  watchedPercentMean: number
  views: StatViewQuery[]
}
