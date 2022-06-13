export enum SearchTypes {
  VIDEO = 'video',
  QUIZ = 'quiz',
  USER = 'user',
  COURSE = 'course',
  MODULE = 'module',
}

export interface SearchResult {
  /** The ID of the result (could be a UUID or a slug) */
  id: string
  /** The type of the result to filter results */
  type: SearchTypes
}

export interface SearchVideo extends SearchResult {
  /** The slug of the video */
  slug: string
  /** The title of the video */
  title: string
  /** The description of the video */
  description: string
  /** The thumbnail URL of the video */
  thumbnail: string
}

export interface SearchQuiz extends SearchResult {
  /** The name of the quiz */
  name: string
}

export interface SearchUser extends SearchResult {
  avatar: string
  firstName: string
  lastName: string
  username: string
}

export interface SearchModule extends SearchResult {
  name: string
  slug: string
  description: string
}

export interface SearchCourse extends SearchResult {
  name: string
  slug: string
  shortDescription: string
}

export interface PaginatedSearchResult {
  results: SearchResult[]
  totalElements: number
  totalPages: number
  currentPage: number
}

export interface SortedPaginatedSearchResult {
  videos: SearchVideo[]
  quizzes: SearchQuiz[]
  users: SearchUser[]
  modules: SearchModule[]
  courses: SearchCourse[]
  totalElements: number
  totalPages: number
  currentPage: number
}
