/**
 * Exposes the 5 methods needed to perform CRUD actions.
 * Also allows you to manage the display and modal or snackbar on certain raw actions
 */
import { TFunction } from 'i18next'

import { Container } from '@polyflix/di'

import { APP_TRANSLATION } from '@core/constants/app.constant'

import {
  ApiType,
  ApiVersion,
  CrudAction,
  IApiResponse,
} from '../types/http.type'
import { HttpUtils } from '../utils/http-utils'
import { ApiService } from './api.service'
import { HttpService } from './http.service'
import { SnackbarService } from './snackbar.service'

export abstract class CrudAbstractService<
  T extends { id?: string }
> extends HttpUtils {
  protected apiService: ApiService

  protected snackbarService: SnackbarService

  protected translate: TFunction

  protected endpoint: string

  constructor(
    protected http: HttpService,
    protected apiVersion: ApiVersion = ApiVersion.V1,
    protected apiEndpoint: string,
    protected apiType?: ApiType
  ) {
    super()
    // Get all of our services from the IoC container
    this.apiService = Container.get<ApiService>(ApiService)
    this.snackbarService = Container.get<SnackbarService>(SnackbarService)
    this.translate = Container.get<TFunction>(APP_TRANSLATION)

    // Build the endpoint for the resource
    this.endpoint = `${this.apiService.endpoint(
      apiVersion,
      apiType
    )}/${apiEndpoint}`
  }

  async delete(item: T): Promise<IApiResponse<void>> {
    return this.http.delete(`${this.endpoint}/${item.id}`).then((res) => {
      this.notify(CrudAction.DELETE)
      return res
    })
  }

  async findAll(): Promise<IApiResponse<T[]>> {
    return this.http.get(`${this.endpoint}`)
  }

  async get(id: string): Promise<IApiResponse<T>> {
    return this.http.get(`${this.endpoint}/${id}`)
  }

  async save(item: T, snackbar: boolean = true): Promise<IApiResponse<T>> {
    return this.http
      .post(`${this.endpoint}`, {
        body: item,
      })
      .then((res) => {
        if (snackbar) {
          this.notify(CrudAction.CREATE)
        }
        return res
      })
  }

  async update(
    item: T,
    snackbar: boolean = true
  ): Promise<IApiResponse<T | void>> {
    return this.http
      .put(`${this.endpoint}/${item.id}`, {
        body: item,
      })
      .then((res) => {
        if (snackbar) {
          this.notify(CrudAction.CREATE)
        }
        return res
      })
  }

  /**
   * Notify the user with snackbars of an action.
   * @param action the action
   */
  private notify(action: CrudAction): void {
    const translatedAction = this.translate(`snackbar.crudMessage`, {
      action: this.translate(`actions.${action}`, {
        ns: 'common',
      }),
      resource: this.translate(`${this.apiEndpoint}`, {
        ns: 'resources',
      }),
    })
    this.snackbarService.createSnackbar(translatedAction, {
      variant: 'success',
    })
  }
}
