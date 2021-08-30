import { Injectable } from '@polyflix/di'
import { StatusCodes } from 'http-status-codes'
import { HttpService } from '../../common/services/http.service'

@Injectable()
export class SubtitleImprovementMetaService {
  private endpoint: string
  constructor(private readonly http: HttpService) {
    this.endpoint = '/subtitle-improvements-meta'
  }

  async patchIsLiked(id: string, isLiked: boolean): Promise<void> {
    const { status, response, error } = await this.http.patch(
      `${this.endpoint}/${id}/isLiked`,
      {
        body: {
          isLiked,
        },
      }
    )
    if (status !== StatusCodes.NO_CONTENT) {
      throw error
    }
    return response
  }
}
