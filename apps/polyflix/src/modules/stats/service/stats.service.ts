import { Injectable } from '@polyflix/di'

import { ApiService } from '@services/endpoint.service'
import { HttpService } from '@services/http.service'
import { ApiVersion } from '@types_/http.type'

import { IVideoStatsFilter } from '../filters/date.filter'
import { StatView } from '../types/StatView.type'

@Injectable()
export class StatsService {
  protected endpoint: string

  constructor(
    private readonly httpService: HttpService,
    private readonly apiService: ApiService
  ) {
    this.endpoint = `${this.apiService.endpoint(ApiVersion.V1)}/stats`
  }

  public async getVideoStats(
    slug: string,
    filters: IVideoStatsFilter = {}
  ): Promise<StatView> {
    const urlParams = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
      urlParams.set(key, value)
    })
    const searchQuery = urlParams.toString()

    let url = `${this.endpoint}/video/${slug}`
    if (searchQuery !== '' && searchQuery) {
      url += `?${searchQuery}`
    }

    const { status, response, error } = await this.httpService.get(url)
    if (status !== 200) {
      throw error
    }
    return response
  }
}
