export interface StatViewQuery {
  viewsCount: number
  likesCount: number
  watchedPercentMean: number
  createdAt: string
}

export interface StatView {
  viewsCount: number
  likesCount: number
  watchedPercentMean: number
  views: StatViewQuery[]
}
