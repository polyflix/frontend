import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from "axios";
import { Injectable } from "../../di";
import { API_URL } from "../constants/api.constant";
import { IApiResponse, IRequestOptions } from "../types/http.type";
import { BaseHttpService } from "./abastract-http.service";

@Injectable()
export class HttpService implements BaseHttpService {
  private _axios: AxiosInstance;

  constructor() {
    this._axios = axios.create({
      baseURL: API_URL,
      withCredentials: true,
    });

    this._axios.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const originalRequest = error.config;
        const { status } = error.response;

        if (status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const res = await this.post("/auth/refresh");

          const { error: error_1, response } = res;

          if (error_1) return Promise.reject(error_1);

          const { token } = response;

          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${token}`,
          };
          return await axios(originalRequest);
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Execute an HTTP GET call on a specific path.
   * @param {string} path the request path
   * @param {IRequestOptions} options the request options
   * @returns {IApiResponse} the response
   */
  async get(path: string, options?: IRequestOptions): Promise<IApiResponse> {
    return await this._fetch("GET", path, options);
  }

  /**
   * Execute an HTTP POST call on a specific path.
   * @param {string} path the request path
   * @param {IRequestOptions} options the request options
   * @returns {IApiResponse} the response
   */
  async post(path: string, options?: IRequestOptions): Promise<IApiResponse> {
    return await this._fetch("POST", path, options);
  }

  /**
   * Execute an HTTP PATCH call on a specific path.
   * @param {string} path the request path
   * @param {IRequestOptions} options the request options
   * @returns {IApiResponse} the response
   */
  async patch(path: string, options?: IRequestOptions): Promise<IApiResponse> {
    return await this._fetch("PATCH", path, options);
  }

  /**
   * Execute an HTTP DELETE call on a specific path.
   * @param {string} path the request path
   * @param {IRequestOptions} options the request options
   * @returns {IApiResponse} the response
   */
  async delete(path: string, options?: IRequestOptions): Promise<IApiResponse> {
    return await this._fetch("DELETE", path, options);
  }

  /**
   * Execute an HTTP call.
   * @param {Method} method the request method
   * @param {string} path the request path
   * @param {IRequestOptions} options the request options
   * @returns {IApiResponse} the HTTP call response
   */
  private async _fetch(
    method: Method,
    path: string,
    options?: IRequestOptions
  ): Promise<IApiResponse> {
    const config = this.getRequestConfiguration(method, path, options);
    try {
      const { data, status } = await this._axios.request(config);
      return {
        status,
        response: data,
      };
    } catch (e) {
      const { status, data, statusText } = e.response;
      return {
        status,
        error: data.message || statusText,
      };
    }
  }

  /**
   * Create the request configuration for Axios.
   * @param {Method} method the request method
   * @param {string} path the request path
   * @param {IRequestOptions} options the request options
   * @returns {AxiosRequestConfig} the configuration
   */
  private getRequestConfiguration(
    method: Method,
    path: string,
    options?: IRequestOptions
  ): AxiosRequestConfig {
    const { body, headers } = options || {};
    const baseConfig: AxiosRequestConfig = {
      method,
      url: path,
    };
    if (body) baseConfig.data = body;
    if (headers) baseConfig.headers = { ...baseConfig.headers, ...headers };
    return baseConfig;
  }
}
