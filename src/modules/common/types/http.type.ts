export interface IApiResponse {
  status: number
  error?: any
  response?: any
}

export interface IRequestOptions {
  body?: any
  headers?: any
}
