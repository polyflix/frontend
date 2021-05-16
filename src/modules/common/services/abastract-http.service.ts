import { IApiResponse, IRequestOptions } from "../types/http.type";

export interface BaseHttpService {
  get: (path: string, options?: IRequestOptions) => Promise<IApiResponse>;
  post: (path: string, options?: IRequestOptions) => Promise<IApiResponse>;
  patch: (path: string, options?: IRequestOptions) => Promise<IApiResponse>;
  delete: (path: string, options?: IRequestOptions) => Promise<IApiResponse>;
}
