import { environment } from '@env/environment'
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from 'axios'
import { StatusCodes } from 'http-status-codes'

import { Inject, Injectable } from '@polyflix/di'

import { APP_DISPATCHER } from '@core/constants/app.constant'
import { healthy, unhealthy } from '@core/reducers/server.slice'
import type { AppDispatch } from '@core/store'
import { store } from '@core/store'

import {
  ApiVersion,
  BaseHttpService,
  IApiResponse,
  IRequestOptions,
} from '../types/http.type'
import { ApiService } from './endpoint.service'

const NETWORK_ERROR = 'Network error'

@Injectable()
export class HttpService implements BaseHttpService {
  private _axios: AxiosInstance

  constructor(
    private readonly apiService: ApiService,
    @Inject(APP_DISPATCHER) private readonly dispatch: AppDispatch
  ) {
    this._axios = axios.create({
      withCredentials: true,
    })

    /**
     * Interceptor used to send a refresh token reauest
     * in the case we receive an unauthorized response
     *
     * Only try once!
     */
    this._axios.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const originalRequest = error.config

        if (error.message === NETWORK_ERROR) throw Error(NETWORK_ERROR)
        if (error?.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          const endpoint = `${apiService.endpoint(ApiVersion.V1)}/auth`
          const res = await this.post(`${endpoint}/refresh`)

          const { error: error1, response } = res

          if (error1) return Promise.reject(error1)

          const { token } = response

          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${token}`,
          }
          return axios(originalRequest)
        }

        return Promise.reject(error)
      }
    )
  }

  /**
   * Execute an HTTP GET call on a specific path.
   * @param {string} path the request path
   * @param {IRequestOptions} options the request options
   * @returns {IApiResponse} the response
   */
  async get(path: string, options?: IRequestOptions): Promise<IApiResponse> {
    return this._fetch('GET', path, options)
  }

  /**
   * Execute an HTTP POST call on a specific path.
   * @param {string} path the request path
   * @param {IRequestOptions} options the request options
   * @returns {IApiResponse} the response
   */
  async post(path: string, options?: IRequestOptions): Promise<IApiResponse> {
    return this._fetch('POST', path, options)
  }

  /**
   * Execute an HTTP PUT call on a specific path.
   * @param {string} path the request path
   * @param {IRequestOptions} options the request options
   * @returns {IApiResponse} the response
   */
  async put(path: string, options?: IRequestOptions): Promise<IApiResponse> {
    return this._fetch('PUT', path, options)
  }

  /**
   * Execute an HTTP PATCH call on a specific path.
   * @param {string} path the request path
   * @param {IRequestOptions} options the request options
   * @returns {IApiResponse} the response
   */
  async patch(path: string, options?: IRequestOptions): Promise<IApiResponse> {
    return this._fetch('PATCH', path, options)
  }

  /**
   * Execute an HTTP DELETE call on a specific path.
   * @param {string} path the request path
   * @param {IRequestOptions} options the request options
   * @returns {IApiResponse} the response
   */
  async delete(path: string, options?: IRequestOptions): Promise<IApiResponse> {
    return this._fetch('DELETE', path, options)
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
    const config = this.getRequestConfiguration(method, path, options)

    try {
      const { data, status } = await this._axios.request(config)

      this.dispatch(healthy())
      return {
        status,
        response: data,
      }
    } catch (e: any) {
      if (
        (e instanceof Error && e.message === NETWORK_ERROR) ||
        e?.response === undefined
      ) {
        this.dispatch(unhealthy())

        return {
          status: StatusCodes.SERVICE_UNAVAILABLE,
          error: e.message,
        }
      }

      const { status, data, statusText } = e.response

      return {
        status,
        error: data.statusText || statusText,
      }
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
    const isUrl = /^(http|https).+/.test(path)
    const { auth } = store.getState()
    const { body, headers } = options || {}
    const baseConfig: AxiosRequestConfig = {
      ...(!isUrl && { baseURL: environment.api }),
      method,
      url: path,
      // By default, if a token is in the store, we pass it in every request
      headers: {
        ...(auth.token && { Authorization: `Bearer ${auth.token}` }),
      },
    }
    if (body) baseConfig.data = body
    if (headers)
      baseConfig.headers = {
        ...baseConfig.headers,
        ...headers,
      }
    return baseConfig
  }
}
