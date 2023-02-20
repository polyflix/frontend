import {
  PaginatedSearchResult,
  SearchQuiz,
  SearchUser,
  SearchVideo,
  SortedPaginatedSearchResult,
} from '@types_/resources/search.type'
import { SearchFilters } from '@search/types/filters.type'
import { StatusCodes } from 'http-status-codes'
import { groupBy } from 'lodash'

import { Injectable } from '@polyflix/di'

import { Endpoint } from '@constants/endpoint.constant'
import { ApiService } from '@services/endpoint.service'
import { HttpService } from '@services/http.service'
import { ApiVersion } from '@types_/http.type'

@Injectable()
export class SearchService {
  protected endpoint: string

  constructor(
    private readonly apiService: ApiService,
    private readonly httpService: HttpService
  ) {
    this.endpoint = `${this.apiService.endpoint(ApiVersion.V2)}/${
      Endpoint.Search
    }`
  }

  /**
   *	Send a search query
   *
   * @param {SearchFilters} filters The filters to search, including the query
   * @returns {Promise<SortedPaginatedSearchResult>}
   */
  public async searchFor(
    filters: SearchFilters
  ): Promise<SortedPaginatedSearchResult> {
    if (filters.query === '') {
      return this.sortSearchResults({
        results: [],
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
      })
    }
    const { status, response, error } = await this.httpService.get(
      `${this.endpoint}?q=${filters.query}&page=${filters.page}&size=${filters.size}`
    )
    if (status !== StatusCodes.OK) {
      throw error
    }
    return this.sortSearchResults(response)
  }

  private sortSearchResults(
    rawResults: PaginatedSearchResult
  ): SortedPaginatedSearchResult {
    const sortedResults = groupBy(rawResults.results, 'type')
    return {
      videos: (sortedResults.video as SearchVideo[]) || [],
      quizzes: (sortedResults.quiz as SearchQuiz[]) || [],
      users: (sortedResults.user as SearchUser[]) || [],
      ...rawResults,
    }
  }
}
