/**
 * Exposes the 5 methods needed to perform CRUD actions.
 * Also allows you to manage the display and modal or snackbar on certain raw actions
 */
import { EntityId } from '@reduxjs/toolkit'
import { TFunction } from 'i18next'

import { Container } from '@polyflix/di'

import { APP_DISPATCHER, APP_TRANSLATION } from '@core/constants/app.constant'
import { BaseModel } from '@core/models/base.model'
import type { AppDispatch } from '@core/store'

import {
  ApiType,
  ApiVersion,
  CrudAction,
  IApiResponse,
  WithPagination,
} from '../types/http.type'
import { HttpUtils } from '../utils/http-utils'
import { ApiService } from './api.service'
import { HttpService } from './http.service'
import { SnackbarService } from './snackbar.service'

export abstract class CrudAbstractService<
  Type extends BaseModel,
  DTO
> extends HttpUtils {
  protected httpService: HttpService

  protected apiService: ApiService

  protected snackbarService: SnackbarService

  protected translate: TFunction

  protected dispatch: AppDispatch

  protected endpoint: string

  constructor(
    protected apiVersion: ApiVersion = ApiVersion.V1,
    protected apiEndpoint: string,
    protected apiType?: ApiType
  ) {
    super()
    // Get all of our services from the IoC container
    this.httpService = Container.get<HttpService>(HttpService)
    this.apiService = Container.get<ApiService>(ApiService)
    this.snackbarService = Container.get<SnackbarService>(SnackbarService)
    this.translate = Container.get<TFunction>(APP_TRANSLATION)
    this.dispatch = Container.get<AppDispatch>(APP_DISPATCHER)

    // Build the endpoint for the resource
    this.endpoint = `${this.apiService.endpoint(
      apiVersion,
      apiType
    )}/${apiEndpoint}`
  }

  abstract delete(item: Type): Promise<IApiResponse<void>>
  abstract findAll(): Promise<IApiResponse<WithPagination<Type[]>>>
  abstract get(item: Type): Promise<Type>
  abstract getById(id: EntityId): Promise<Type>
  abstract save(data: DTO): Promise<Type>
  abstract update(id: EntityId, data: DTO): Promise<Type | void>

  /**
   * Notify the user with snackbars of an action.
   * @param action the action
   */
  protected notify(action: CrudAction): void {
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
