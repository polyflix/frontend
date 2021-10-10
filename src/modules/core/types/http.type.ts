export interface IApiResponse {
  status: number
  error?: any
  response?: any
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
