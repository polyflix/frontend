export enum SearchTypes {
  VIDEO = 'video',
  QUIZ = 'quiz',
}

export interface SearchResult {
  /** The ID of the result (could be a UUID or a slug) */
  id: string
  /** The type of the result to filter results */
  type: SearchTypes
}

export interface SearchVideo extends SearchResult {
  /** The title of the video */
  title: string
  /** The description of the video */
  description: string
}

export interface SearchQuiz extends SearchResult {
  /** The name of the quiz */
  name: string
}

export interface PaginatedSearchResult {
  results: SearchResult[]
  totalElements: number
  totalPages: number
  currentPage: number
}
