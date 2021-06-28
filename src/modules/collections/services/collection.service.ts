import { Injectable } from "@polyflix/di";
import { StatusCodes } from "http-status-codes";
import { HttpService } from "../../common/services/http.service";
import { Collection } from "../models";
import {
  ICollectionForm,
  CollectionsWithPagination,
  CollectionParams,
} from "../types";

@Injectable()
export class CollectionService {
  constructor(private readonly httpService: HttpService) {}

  /**
   * Get the collections list paginated.
   * @param {number | undefined} publisherId the user to get collections from
   * @param {number | undefined} page the page to fetch
   * @param {number | undefined} pageSize the limit of items per page
   * @returns {Promise<CollectionsWithPagination>}
   */
  public async getCollections(
    params: CollectionParams
  ): Promise<CollectionsWithPagination> {
    const { pageSize, page, publisherId, title } = params;
    const path = "/collections";
    // Build search query
    let query = new URLSearchParams();
    if (page) query.append("page", page.toString());
    if (pageSize) query.append("pageSize", pageSize.toString());
    if (publisherId) query.append("publisherId", publisherId);
    if (title) query.append("title", title);

    // Build the URL for the request.
    // The format is the following : /collections[?page=1&pageSize=20]
    const url = `${path}${query ? "?" + query.toString() : ""}`;

    const { status, response, error } = await this.httpService.get(url);
    if (status !== 200) {
      throw error;
    }
    return {
      totalCount: response.totalCount,
      items: response.items.map(Collection.fromJson),
    };
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
    );
    if (status !== StatusCodes.CREATED) {
      throw error;
    }
    return response;
  }

  /**
   * Delete a collection
   * @param {string} id the collection id
   */
  public async deleteCollection(id: string): Promise<void> {
    const { status, error } = await this.httpService.delete(
      `/collections/${id}`
    );
    if (status !== StatusCodes.NO_CONTENT) {
      throw error;
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
    );
    if (status !== StatusCodes.OK) {
      throw error;
    }
    return Collection.fromJson(response);
  }

  /**
   * Find a video by slug.
   * @param {string} slug the video slug
   * @returns {Promise<Video>}
   */
  public async getCollectionBySlug(slug: string): Promise<Collection> {
    const { status, response, error } = await this.httpService.get(
      `/collections/${slug}`
    );
    if (status !== StatusCodes.OK) {
      throw error;
    }
    // const subtitles = await this.subtitleService.getSubtitleUrlByVideoId(
    //   response.id
    // );

    return Collection.fromJson(response);
  }
}
