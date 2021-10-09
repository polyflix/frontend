import { Injectable } from "@polyflix/di";
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from "axios";
import { StatusCodes } from "http-status-codes";
import { API_URL, NETWORK_ERROR } from "../constants/api.constant";
import { store } from "../redux";
import {
  serverStateOfflineAction,
  serverStateOnlineAction,
} from "../redux/actions/serverState.action";
import { IApiResponse, IRequestOptions } from "../types/http.type";
import { ServerStateAction } from "../types/serverState.type";
import { BaseHttpService } from "./abastract-http.service";
import { ReduxService } from "./redux.service";

@Injectable()
export class HttpService implements BaseHttpService {
  private _axios: AxiosInstance;

  constructor(private readonly reduxService: ReduxService<ServerStateAction>) {
    this._axios = axios.create({
      withCredentials: true,
    });

    /**
     * Interceptor used to send a refresh token reauest
     * in the case we receive an unauthorized response
     *
     * Only try once!
     */
    this._axios.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.message === NETWORK_ERROR) throw Error(NETWORK_ERROR);
        if (error?.response?.status === 401 && !originalRequest._retry) {
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
   * Execute an HTTP PUT call on a specific path.
   * @param {string} path the request path
   * @param {IRequestOptions} options the request options
   * @returns {IApiResponse} the response
   */
  async put(path: string, options?: IRequestOptions): Promise<IApiResponse> {
    return await this._fetch("PUT", path, options);
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
      this.reduxService.dispatch(serverStateOnlineAction());
      return {
        status,
        response: data,
      };
    } catch (e) {
      if (
        (e instanceof Error && e.message === NETWORK_ERROR) ||
        e?.response === undefined
      ) {
        this.reduxService.dispatch(serverStateOfflineAction());
        return {
          status: StatusCodes.SERVICE_UNAVAILABLE,
          error: e.message,
        };
      }

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
    const isUrl = /^(http|https).+/.test(path);
    const { auth } = store.getState();
    const { body, headers } = options || {};
    const baseConfig: AxiosRequestConfig = {
      ...(!isUrl && { baseURL: API_URL }),
      method,
      url: path,
      // By default, if a token is in the store, we pass it in every request
      headers: {
        ...(auth.token && auth.token.getAuthorizationHeader()),
      },
    };
    if (body) baseConfig.data = body;
    if (headers)
      baseConfig.headers = {
        ...baseConfig.headers,
        ...headers,
      };
    return baseConfig;
  }
}
