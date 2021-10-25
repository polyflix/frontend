export interface IApiResponse<T = any> {
  status: number
  error?: any
  response?: T
}

export interface WithPagination<T> {
  items: T
  totalCount: number
}

export enum CrudAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum ApiType {
  POLYFLIX = 'polyflix',
}

export enum ApiVersion {
  V1 = 'v1',
}

export interface IRequestOptions {
  body?: any
  headers?: any
}

export interface BaseHttpService {
  get: (path: string, options?: IRequestOptions) => Promise<IApiResponse>
  post: (path: string, options?: IRequestOptions) => Promise<IApiResponse>
  put: (path: string, options?: IRequestOptions) => Promise<IApiResponse>
  patch: (path: string, options?: IRequestOptions) => Promise<IApiResponse>
  delete: (path: string, options?: IRequestOptions) => Promise<IApiResponse>
}

export interface WithPagination<T> {
  items: T
  totalCount: number
}
