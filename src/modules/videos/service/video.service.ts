import { Video } from '@videos/models/video.model'
import { error, start, success } from '@videos/reducers/video.slice'
import { IVideoForm } from '@videos/types/form.type'
import { StatusCodes } from 'http-status-codes'

import { Injectable } from '@polyflix/di'

import { CrudAbstractService } from '@core/services/crud-abstract.service'
import { HttpService } from '@core/services/http.service'
import { ApiVersion, IApiResponse, WithPagination } from '@core/types/http.type'

@Injectable()
export class VideoService extends CrudAbstractService<Video, IVideoForm> {
  constructor(protected readonly httpService: HttpService) {
    super(httpService, ApiVersion.V1, 'videos')
  }

  async findAll(): Promise<IApiResponse<WithPagination<Video[]>>> {
    this.dispatch(start())

    const {
      response,
      status,
      error: err,
    } = await this.httpService.get(this.endpoint)

    if (status !== StatusCodes.OK) {
      this.dispatch(error(new Error(err)))
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw error
    }

    this.dispatch(success(response.items))

    return response
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  delete(item: Video): Promise<IApiResponse<void>> {
    throw new Error('Method not implemented.')
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  get(item: Video): Promise<IApiResponse<Video>> {
    throw new Error('Method not implemented.')
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async save(data: IVideoForm): Promise<IApiResponse<Video>> {
    throw new Error('Method not implemented.')
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(data: IVideoForm): Promise<IApiResponse<void | Video>> {
    throw new Error('Method not implemented.')
  }
}
