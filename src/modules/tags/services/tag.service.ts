import { Injectable } from "@polyflix/di";
import { StatusCodes } from "http-status-codes";

import { Tag } from "../models/tag.model";
import { ITagForm } from "../types/tag.type";
import { HttpService } from "../../common/services";
import { Collection, CollectionsWithPagination } from "../../collections";
import { Video, VideosWithPagination } from "../../videos";
import { ITagFilter, TagFilter } from "../filters/tag.filter";

@Injectable()
export class TagService {
  constructor(
    private readonly httpService: HttpService,
    private readonly tagFilter: TagFilter
  ) {}

  public async getTags(filters: ITagFilter): Promise<Tag[]> {
    const searchQuery = this.tagFilter.buildFilters(filters);
    let url = "/tags";
    if (searchQuery !== "" && searchQuery) {
      url += `?${searchQuery}`;
    }

    const { status, response, error } = await this.httpService.get(url);
    if (status !== StatusCodes.OK) throw error;
    return response.map(Tag.fromJson);
  }

  public async createTag(tag: ITagForm): Promise<Tag> {
    const { status, response, error } = await this.httpService.post(`/tags`, {
      body: tag,
    });
    if (status !== StatusCodes.CREATED) throw error;
    return Tag.fromJson(response);
  }

  public async updateTag(id: string, tag: ITagForm): Promise<Tag> {
    const { status, response, error } = await this.httpService.put(
      `/tags/${id}`,
      {
        body: tag,
      }
    );
    if (status !== StatusCodes.OK) throw error;
    return Tag.fromJson(response);
  }

  public async deleteTag(id: string): Promise<void> {
    const { status, error } = await this.httpService.delete(`/tags/${id}`);
    if (status !== StatusCodes.NO_CONTENT) throw error;
  }

  public async searchCollectionsByTags(
    tags: Tag[]
  ): Promise<CollectionsWithPagination> {
    const queryParams = TagService.buildQueryParams(tags);
    const { status, response, error } = await this.httpService.get(
      `/collections${queryParams}`
    );
    if (status !== StatusCodes.OK) throw error;
    return {
      items: response.items.map(Collection.fromJson),
      totalCount: response.totalCount,
    };
  }

  public async searchVideosByTags(tags: Tag[]): Promise<VideosWithPagination> {
    const queryParams = TagService.buildQueryParams(tags);
    const { status, response, error } = await this.httpService.get(
      `/videos${queryParams}`
    );
    if (status !== StatusCodes.OK) throw error;
    return {
      items: response.items.map(Video.fromJson),
      totalCount: response.totalCount,
    };
  }

  public static buildQueryParams(tags: Tag[]): string {
    let res = "?";
    for (const tag of tags) {
      res += `tags[]=${tag.label}&`;
    }
    return res.substring(0, res.length - 1);
  }

  public static TagsToURL(tags: Tag[]): string {
    let res = "";
    for (const tag of tags) {
      res += `${tag.label}&`;
    }
    return res.substring(0, res.length - 1);
  }

  public static URLToTags(url: string): Tag[] {
    return url
      .split("&")
      .map((label) =>
        Tag.fromJson({ id: "", label, isReviewed: false, color: "#000000" })
      );
  }
}
