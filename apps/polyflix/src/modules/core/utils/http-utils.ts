export abstract class HttpUtils {
  cleanFilters(filters: any): any {
    return this.formatFilters(filters)
  }

  protected formatFilters(params: any): any {
    // TODO
    return params
  }
}

export const buildQueryParams = (object: { [k: string]: any }): string => {
  const params = new URLSearchParams()
  Object.keys(object).forEach((key) => {
    params.set(key, object[key])
  })
  return params.toString()
}
