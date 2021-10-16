/**
 * Exposes the 5 methods needed to perform CRUD actions.
 * Also allows you to manage the display and modal or snackbar on certain raw actions
 */
import { Container } from '@polyflix/di'

import {
  ApiType,
  ApiVersion,
  CrudAction,
  IApiResponse,
} from '../types/http.type'
import { HttpUtils } from '../utils/http-utils'
import { ApiService } from './api.service'
import { HttpService } from './http.service'
import { SnackBarService } from './snackbar.service'
import { TranslateService } from './translate.service'

export abstract class CrudAbstractService<
  T extends { id?: string }
> extends HttpUtils {
  protected apiService: ApiService

  protected snackbarService: SnackBarService

  protected endpoint: string

  private readonly resource: string

  private readonly translateService: TranslateService

  constructor(
    protected http: HttpService,
    protected apiVersion: ApiVersion = ApiVersion.V1,
    protected apiEndpoint: string,
    protected apiType?: ApiType
  ) {
    super()
    this.apiService = Container.get<ApiService>(ApiService)
    this.endpoint = `${this.apiService.endpoint(
      apiVersion,
      apiType
    )}/${apiEndpoint}`
    this.snackbarService = Container.get<SnackBarService>(SnackBarService)
    this.translateService = Container.get<TranslateService>(TranslateService)
    this.resource = this.getResourceKeyFromEndpoint(this.apiEndpoint)
  }

  async delete(item: T): Promise<IApiResponse<void>> {
    this.displaySnackbar(CrudAction.DELETE)
    return this.http.delete(`${this.endpoint}/${item.id}`)
  }

  async findAll(): Promise<IApiResponse<T[]>> {
    this.displaySnackbar(CrudAction.UPDATE)
    return this.http.get(`${this.endpoint}`)
  }

  async get(id: string): Promise<IApiResponse<T>> {
    return this.http.get(`${this.endpoint}/${id}`)
  }

  async save(item: T, snackbar: boolean = true): Promise<IApiResponse<T>> {
    if (snackbar) {
      this.displaySnackbar(CrudAction.CREATE)
    }
    return this.http.post(`${this.endpoint}`, {
      body: item,
    })
  }

  async update(
    item: T,
    snackbar: boolean = true
  ): Promise<IApiResponse<T | void>> {
    if (snackbar) {
      this.displaySnackbar(CrudAction.UPDATE)
    }
    return this.http.put(`${this.endpoint}/${item.id}`, {
      body: item,
    })
  }

  private displaySnackbar(action: CrudAction): void {
    // TODO translate ressource
    this.snackbarService.displaySnackbar(this.resource, action)
  }

  private getResourceKeyFromEndpoint(endpoint: string): string {
    // TODO
    return endpoint
  }
}
