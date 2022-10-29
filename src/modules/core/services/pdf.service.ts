import { StatusCodes } from 'http-status-codes'

import { Injectable } from '@polyflix/di'

import { Endpoint } from '@core/constants/endpoint.constant'
import { ApiVersion } from '@core/types/http.type'

import { ApiService } from './endpoint.service'
import { HttpService } from './http.service'

@Injectable()
export class PdfService {
  protected endpoint: string

  constructor(
    private readonly apiService: ApiService,
    private readonly httpService: HttpService
  ) {
    this.endpoint = `${this.apiService.endpoint(ApiVersion.V2)}`
  }

  async getCertificatePdfQuery(id: string): Promise<Blob> {
    const { status, response, error } = await this.httpService.get(
      `${this.endpoint}/${Endpoint.Certifications}/certificate/${id}`,
      {
        headers: {
          'Content-Type': 'application/pdf',
        },
        responseType: 'blob',
      }
    )

    if (status !== StatusCodes.OK) {
      throw error
    }
    return response
  }
}
