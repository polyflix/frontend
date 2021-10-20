import { Video } from '@videos/models/video.model'
import { IVideoForm } from '@videos/types/form.type'

import { Injectable } from '@polyflix/di'

import { CrudAbstractService } from '@core/services/crud-abstract.service'
import { HttpService } from '@core/services/http.service'
import { ApiVersion, IApiResponse, WithPagination } from '@core/types/http.type'

@Injectable()
export class VideoService extends CrudAbstractService<Video, IVideoForm> {
  constructor(protected readonly httpService: HttpService) {
    super(httpService, ApiVersion.V1, 'videos')
  }

  async delete(item: Video): Promise<IApiResponse<void>> {
    throw new Error('Method not implemented.')
  }

  async findAll(): Promise<IApiResponse<WithPagination<Video[]>>> {
    throw new Error('Method not implemented.')
  }

  async get(item: Video): Promise<IApiResponse<Video>> {
    throw new Error('Method not implemented.')
  }

  async save(data: IVideoForm): Promise<IApiResponse<Video>> {
    throw new Error('Method not implemented.')
  }

  async update(data: IVideoForm): Promise<IApiResponse<void | Video>> {
    throw new Error('Method not implemented.')
  }
}
