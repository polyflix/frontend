import { User } from '@users/models/user.model'

export interface Group {
  id: string
  name: string
  slug: string
  owner: User
  members: User[]
}

export interface PaginatedGroupResult {
  data: Group[]
  totalElements: number
  totalPages: number
  currentPage: number
}
