import { Injectable } from '@polyflix/di'
import { StatusCodes } from 'http-status-codes'
import { HttpService } from '../../common/services/http.service'
import {
  ISubtitleImprovementFilter,
  SubtitleImprovementFilter,
} from '../filters/subtitle-improvement.filter'
import { SubtitleImprovement } from '../models/subtitle-improvement.model'
import { ISubtitleImprovement } from '../types/subtitle-improvement.type'

@Injectable()
export class SubtitleImprovementService {
  private endpoint: string
  constructor(
    private readonly http: HttpService,
    private readonly subtitleImprovementFilter: SubtitleImprovementFilter
  ) {
    this.endpoint = '/subtitle-improvements'
  }

  async findAll(
    filters: ISubtitleImprovementFilter
  ): Promise<SubtitleImprovement[]> {
    const query = this.subtitleImprovementFilter.buildFilters(filters)

    let url = `${this.endpoint}`
    if (query !== '' && query) {
      url += `?${query}`
    }

    const { status, response, error } = await this.http.get(`${url}`)
    if (status !== StatusCodes.OK) {
      throw error
    }
    return response
  }

  async get(id: string): Promise<SubtitleImprovement> {
    const { status, response, error } = await this.http.get(
      `${this.endpoint}/${id}`
    )
    if (status !== StatusCodes.OK) {
      throw error
    }
    return response
  }

  async create(data: ISubtitleImprovement): Promise<SubtitleImprovement> {
    const { status, response, error } = await this.http.post(
      `${this.endpoint}`,
      {
        body: data,
      }
    )
    if (status !== StatusCodes.CREATED) {
      throw error
    }
    return response
  }

  async update(data: ISubtitleImprovement): Promise<void> {
    const { status, error } = await this.http.put(
      `${this.endpoint}/${data.id}`,
      {
        body: data,
      }
    )
    if (status !== StatusCodes.NO_CONTENT) {
      throw error
    }
  }

  async delete(id: string): Promise<void> {
    const { status, error } = await this.http.delete(`${this.endpoint}/${id}`)
    if (status !== StatusCodes.NO_CONTENT) {
      throw error
    }
  }

  async patchLikes(id: string, likes: number): Promise<void> {
    const { status, error } = await this.http.patch(
      `${this.endpoint}/${id}/likes`,
      {
        body: {
          likes,
        },
      }
    )
    if (status !== StatusCodes.NO_CONTENT) {
      throw error
    }
  }

  async patchApproved(id: string, isApproved: boolean): Promise<void> {
    const { status, error } = await this.http.patch(
      `${this.endpoint}/${id}/isApproved`,
      {
        body: {
          isApproved,
        },
      }
    )
    if (status !== StatusCodes.NO_CONTENT) {
      throw error
    }
  }
}
