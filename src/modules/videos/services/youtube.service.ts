import { StatusCodes } from 'http-status-codes'

import { Injectable } from '@polyflix/di'

import { ApiService } from '@core/services/endpoint.service'
import { HttpService } from '@core/services/http.service'
import { SnackbarService } from '@core/services/snackbar.service'
import { ApiVersion } from '@core/types/http.type'

import { YouTubeVideoMetadata } from '@videos/types/video.type'

@Injectable()
export class YoutubeService {
  private readonly endpoint: string

  constructor(
    private readonly httpService: HttpService,
    private readonly apiService: ApiService,
    private readonly snackbarService: SnackbarService
  ) {
    this.endpoint = apiService.endpoint(ApiVersion.V2)
  }

  /**
   * Find youtube video metadata.
   * @param {string} id the youtube video id
   * @returns {Promise<any>}
   */
  public async getVideoMetadata(url: string): Promise<YouTubeVideoMetadata> {
    const { status, response, error } = await this.httpService.get(
      `${this.endpoint}/videos/metadata/${this.getIdFromYoutubeUrl(url)}`
    )

    if (status !== StatusCodes.OK) {
      throw error
    }

    const {
      title,
      description,
      thumbnails: { high },
    } = response.snippet

    this.snackbarService.createSnackbar(`Metadata found for your video.`, {
      variant: 'success',
    })

    return {
      title,
      description,
      thumbnail: high.url,
    }
  }

  private getIdFromYoutubeUrl(url: string): string {
    if (url.match('youtu.be/')) {
      const { pathname } = new URL(url)
      if (pathname !== '/') return pathname.substring(1)
    } else {
      const { searchParams } = new URL(url)
      const id = searchParams.get('v')
      if (id) return id
    }

    throw new Error(`Failed to get the id from the youtube url : ${url}`)
  }
}
