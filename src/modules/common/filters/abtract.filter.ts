export abstract class AbstractFilter<T> {
  protected queryBuilder: URLSearchParams = new URLSearchParams()

  public abstract buildFilters(filters: Partial<T> | T): string

  public clear(): void {
    this.queryBuilder = new URLSearchParams()
  }
}
