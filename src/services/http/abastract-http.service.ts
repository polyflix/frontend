import { ApiResponse, RequestOptions } from "../../types/http.type";

export interface BaseHttpService {
  get: (path: string, options?: RequestOptions) => Promise<ApiResponse>;
  post: (path: string, options?: RequestOptions) => Promise<ApiResponse>;
  patch: (path: string, options?: RequestOptions) => Promise<ApiResponse>;
  delete: (path: string, options?: RequestOptions) => Promise<ApiResponse>;
}
