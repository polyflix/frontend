import { Injectable } from '@polyflix/di'
import { StatusCodes } from 'http-status-codes'

import { HttpService } from '../../common/services/http.service'
import { Video } from '../models'
import { Subtitle } from '../models/subtitle.model'

@Injectable()
export class SubtitleService {
  constructor(private readonly httpService: HttpService) {}

  /**
   * Find a Subtitle by its video id.
   * @param {string} videoId id of the video
   * @returns {Promise<Subtitle>}
   */
  public async getSubtitleUrlByVideoId(videoId: string): Promise<Subtitle[]> {
    const { status, response, error } = await this.httpService.get(
      `/subtitles?videoId=${videoId}`
    )
    if (status !== StatusCodes.OK) {
      throw error
    }
    return Promise.all(response.map(Subtitle.fromJson))
  }

  /**
   * Create subtitles for a video
   * @param {string} videoID
   */
  public async createSubtitle(video: Video): Promise<void> {
    const { status, error } = await this.httpService.post(`/subtitles`, {
      body: { lang: 'fr-FR', video: video },
    })
    if (status !== StatusCodes.CREATED) {
      throw error
    }
  }

  /**
   * Delte all subtitles of a video
   * @param {string} videoID
   */
  public async deleteSubtitle(videoId: string): Promise<void> {
    const { status, error } = await this.httpService.delete(`/subtitles`, {
      body: { videoId: videoId },
    })
    if (status !== StatusCodes.NO_CONTENT) {
      throw error
    }
  }
}
