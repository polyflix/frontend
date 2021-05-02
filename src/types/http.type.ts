export interface ApiResponse {
  status: number;
  error?: any;
  response?: any;
}

export interface RequestOptions {
  body?: any;
  headers?: any;
}
