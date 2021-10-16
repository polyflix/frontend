import { Injectable } from '@polyflix/di'

import { CrudAbstractService } from '@core/services/crud-abstract.service'
import { HttpService } from '@core/services/http.service'
import { ApiVersion } from '@core/types/http.type'

interface Video {
  id?: string
  name: string
}

@Injectable()
export class VideoService extends CrudAbstractService<Video> {
  constructor(protected readonly httpService: HttpService) {
    super(httpService, ApiVersion.V1, 'videos')
  }
}
