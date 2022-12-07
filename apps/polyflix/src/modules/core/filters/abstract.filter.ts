export interface CanFilter<T> {
  createFilters(filters: Partial<T> | T): string
}
