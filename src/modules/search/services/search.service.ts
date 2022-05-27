import { PaginatedSearchResult } from '@search/models/search.model'
import { StatusCodes } from 'http-status-codes'

import { Injectable } from '@polyflix/di'

import { Endpoint } from '@core/constants/endpoint.constant'
import { ApiService } from '@core/services/endpoint.service'
import { HttpService } from '@core/services/http.service'
import { ApiVersion } from '@core/types/http.type'

@Injectable()
export class SearchService {
  protected endpoint: string

  constructor(
    private readonly apiService: ApiService,
    private readonly httpService: HttpService
  ) {
    this.endpoint = `${this.apiService.endpoint(ApiVersion.V2_0_0)}/${
      Endpoint.Search
    }`
  }

  /**
   *	Send a search query
   *
   * @param {string} query -- query string to search
   * @returns {Promise<PaginatedSearchResult>}
   */
  public async searchFor(query: string): Promise<PaginatedSearchResult> {
    const { status, response, error } = await this.httpService.get(
      `${this.endpoint}?q=${query}&page=1&size=10`
    )
    if (status !== StatusCodes.OK) {
      throw error
    }
    return response
  }
}
