import { Injectable } from '@polyflix/di'
import { StatusCodes } from 'http-status-codes'

import { HttpService } from '../../common/services/http.service'
import { IPathFilter, PathFilter } from '../filters/path.filter'
import { Path } from '../models/path.model'
import { IPathForm, PathsWithPagination } from '../types'

@Injectable()
export class PathService {
  constructor(
    private readonly httpService: HttpService,
    private readonly pathFilter: PathFilter
  ) {}

  /**
   * Get the path list paginated.
   * @param {number | undefined} page the page to fetch
   * @param {number | undefined} limit the limit of items per page
   * @returns {Promise<PathsWithPagination>}
   */
  public async getPaths(filters: IPathFilter): Promise<PathsWithPagination> {
    const searchQuery = this.pathFilter.buildFilters(filters)
    let url = '/paths'
    if (searchQuery !== '' && searchQuery) {
      url += `?${searchQuery}`
    }

    const { status, response, error } = await this.httpService.get(url)
    if (status !== 200) {
      throw error
    }
    return {
      totalCount: response.totalCount,
      items: response.items.map(Path.fromJson),
    }
  }

  /**
   * Create a path
   * @param {IPathForm} path the form data to post
   * @returns {Promise<Path>}
   */
  public async createPath(path: IPathForm): Promise<Path> {
    const { status, response, error } = await this.httpService.post(`/paths`, {
      body: path,
    })
    if (status !== StatusCodes.CREATED) {
      throw error
    }
    return response
  }

  /**
   * Delete a path
   * @param {string} id the path id
   */
  public async deletePath(id: string): Promise<void> {
    const { status, error } = await this.httpService.delete(`/paths/${id}`)
    if (status !== StatusCodes.NO_CONTENT) {
      throw error
    }
  }

  /**
   * Update a path
   * @param {string} id the  path id
   * @param {IPathForm} data the path form
   * @returns {Promise<Path>}
   */
  public async updatePath(id: string, data: IPathForm): Promise<Path> {
    const { status, response, error } = await this.httpService.put(
      `/paths/${id}`,
      {
        body: data,
      }
    )
    if (status !== StatusCodes.OK) {
      throw error
    }
    return Path.fromJson(response)
  }

  /**
   * Find a path by slug.
   * @param {string} slug the video slug
   * @returns {Promise<Path>}
   */
  public async getPathBySlug(slug: string): Promise<Path> {
    const { status, response, error } = await this.httpService.get(
      `/paths/${slug}`
    )
    if (status !== StatusCodes.OK) {
      throw error
    }

    return Path.fromJson(response)
  }
}
