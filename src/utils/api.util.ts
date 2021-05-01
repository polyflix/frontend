import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";
import { API_URL } from "../constants/api.constant";

axios.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const originalRequest = error.config;
    const { status } = error.response;
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      return POST("/auth/refresh").then((res: ApiResponse) => {
        const { error, response } = res;
        if (error) return Promise.reject(error);

        const { token } = response;

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${token}`,
        };

        return axios(originalRequest);
      });
    }
  }
);

interface RequestOptions {
  body?: any;
  headers?: any;
}

export interface ApiResponse {
  status: number;
  error?: any;
  response?: any;
}

/**
 * Create the request configuration for Axios.
 * @param {Method} method the request method
 * @param {string} path the request path
 * @param {RequestOptions} options the request options
 * @returns {AxiosRequestConfig} the configuration
 */
const getRequestConfiguration = (
  method: Method,
  path: string,
  options?: RequestOptions
): AxiosRequestConfig => {
  const { body, headers } = options || {};
  const baseConfig: AxiosRequestConfig = {
    method,
    baseURL: API_URL,
    url: path,
    withCredentials: true,
  };
  if (body) baseConfig.data = body;
  if (headers) baseConfig.headers = { ...baseConfig.headers, ...headers };
  return baseConfig;
};

/**
 * Execute an HTTP call.
 * @param {Method} method the request method
 * @param {string} path the request path
 * @param {RequestOptions} options the request options
 * @returns {ApiResponse} the HTTP call response
 */
const fetch = async (
  method: Method,
  path: string,
  options?: RequestOptions
): Promise<ApiResponse> => {
  const config = getRequestConfiguration(method, path, options);
  try {
    const { data, status } = await axios(config);
    return {
      status: status,
      response: data,
    };
  } catch (e) {
    const { status, data } = e.response;
    return {
      status,
      error: data.message,
    };
  }
};

/**
 * Execute an HTTP GET call on a specific path.
 * @param {string} path the request path
 * @param {RequestOptions} options the request options
 * @returns {ApiResponse} the response
 */
export const GET = async (
  path: string,
  options?: RequestOptions
): Promise<ApiResponse> => {
  return await fetch("GET", path, options);
};

/**
 * Execute an HTTP POST call on a specific path.
 * @param {string} path the request path
 * @param {RequestOptions} options the request options
 * @returns {ApiResponse} the response
 */
export const POST = async (
  path: string,
  options?: RequestOptions
): Promise<ApiResponse> => {
  return await fetch("POST", path, options);
};

/**
 * Execute an HTTP PATCH call on a specific path.
 * @param {string} path the request path
 * @param {RequestOptions} options the request options
 * @returns {ApiResponse} the response
 */
export const PATCH = async (
  path: string,
  options?: RequestOptions
): Promise<ApiResponse> => {
  return await fetch("PATCH", path, options);
};

/**
 * Execute an HTTP DELETE call on a specific path.
 * @param {string} path the request path
 * @param {RequestOptions} options the request options
 * @returns {ApiResponse} the response
 */
export const DELETE = async (
  path: string,
  options?: RequestOptions
): Promise<ApiResponse> => {
  return await fetch("DELETE", path, options);
};
