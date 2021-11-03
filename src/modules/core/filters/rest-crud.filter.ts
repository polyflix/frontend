import { Injectable } from '@polyflix/di'

import { CanFilter } from './abstract.filter'

@Injectable()
export class RestCrudFilters<T> implements CanFilter<T> {
  protected queryBuilder: URLSearchParams = new URLSearchParams()

  public createFilters(filters: T | Partial<T>): string {
    this.clear()

    Object.entries(filters).forEach(([key, value]) => {
      this.queryBuilder.set(key, value)
    })

    return `?${this.queryBuilder.toString()}`
  }

  protected clear(): void {
    this.queryBuilder = new URLSearchParams()
  }
}
