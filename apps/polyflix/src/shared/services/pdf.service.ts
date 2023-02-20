import { StatusCodes } from 'http-status-codes'

import { Injectable } from '@polyflix/di'

import { Endpoint } from '@constants/endpoint.constant'
import { ApiVersion } from '@types_/http.type'

import { ApiService } from '@services/endpoint.service'
import { HttpService } from '@services/http.service'

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
