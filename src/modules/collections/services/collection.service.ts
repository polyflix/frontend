import { Injectable } from '@polyflix/di'
import { StatusCodes } from 'http-status-codes'
import { HttpService } from '../../common/services/http.service'
import {
  CollectionFilter,
  ICollectionFilter,
} from '../filters/collection.filter'
import { Collection } from '../models'
import { ICollectionForm, CollectionsWithPagination } from '../types'

@Injectable()
export class CollectionService {
  constructor(
    private readonly httpService: HttpService,
    private readonly collectionFilter: CollectionFilter
  ) {}

  /**
   * Get the collections list paginated.
   * @param {number | undefined} publisherId the user to get collections from
   * @param {number | undefined} page the page to fetch
   * @param {number | undefined} pageSize the limit of items per page
   * @returns {Promise<CollectionsWithPagination>}
   */
  public async getCollections(
    filters: ICollectionFilter
  ): Promise<CollectionsWithPagination> {
    const searchQuery = this.collectionFilter.buildFilters(filters)
    let url = '/collections'
    if (searchQuery !== '' && searchQuery) {
      url += `?${searchQuery}`
    }

    const { status, response, error } = await this.httpService.get(url)
    if (status !== 200) {
      throw error
    }
    return {
      totalCount: response.totalCount,
      items: response.items.map(Collection.fromJson),
    }
  }

  /**
   * Create a collection
   * @param {ICollectionForm} collection the form data to post
   * @returns {Promise<Collection>}
   */
  public async createCollection(
    collection: ICollectionForm
  ): Promise<Collection> {
    const { status, response, error } = await this.httpService.post(
      `/collections`,
      {
        body: collection,
      }
    )
    if (status !== StatusCodes.CREATED) {
      throw error
    }
    return response
  }

  /**
   * Delete a collection
   * @param {string} id the collection id
   */
  public async deleteCollection(id: string): Promise<void> {
    const { status, error } = await this.httpService.delete(
      `/collections/${id}`
    )
    if (status !== StatusCodes.NO_CONTENT) {
      throw error
    }
  }

  /**
   * Update a collection
   * @param {string} id the collection id
   * @param {ICollectionForm} data the collection form
   * @returns {Promise<Collection>}
   */
  public async updateCollection(
    id: string,
    data: ICollectionForm
  ): Promise<Collection> {
    const { status, response, error } = await this.httpService.put(
      `/collections/${id}`,
      {
        body: data,
      }
    )
    if (status !== StatusCodes.OK) {
      throw error
    }
    return Collection.fromJson(response)
  }

  /**
   * Find a video by slug.
   * @param {string} slug the video slug
   * @returns {Promise<Video>}
   */
  public async getCollectionBySlug(slug: string): Promise<Collection> {
    const { status, response, error } = await this.httpService.get(
      `/collections/${slug}`
    )
    if (status !== StatusCodes.OK) {
      throw error
    }

    return Collection.fromJson(response)
  }
}
