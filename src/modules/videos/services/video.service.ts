import { Injectable } from "@polyflix/di";
import { StatusCodes } from "http-status-codes";
import { HttpService } from "../../common/services/http.service";
import { IVideoFilter, VideoFilter } from "../filters/video.filter";
import { Video } from "../models/video.model";
import {
  IVideoForm,
  VideoPSU,
  VideosWithPagination,
} from "../types/videos.type";
import { SubtitleService } from "./subtitle.service";
import { youtube_v3 } from "googleapis";

@Injectable()
export class VideoService {
  constructor(
    private readonly httpService: HttpService,
    private readonly subtitleService: SubtitleService,
    private readonly videoFilter: VideoFilter
  ) {}

  /**
   * Get the videos list paginated.
   * @param {number | undefined} authorId the user to get videos from
   * @param {number | undefined} page the page to fetch
   * @param {number | undefined} limit the limit of items per page
   * @returns {Promise<VideosWithPagination>}
   */
  public async getVideos(filters: IVideoFilter): Promise<VideosWithPagination> {
    const searchQuery = this.videoFilter.buildFilters(filters);
    let url = "/videos";
    if (searchQuery !== "" && searchQuery) {
      url += `?${searchQuery}`;
    }

    const { status, response, error } = await this.httpService.get(url);
    if (status !== 200) {
      throw error;
    }
    return {
      totalCount: response.totalCount,
      items: response.items.map(Video.fromJson),
    };
  }

  /**
   * Create a video
   * @param {IVideoForm} video the form data to post
   * @returns {Promise<Video>}
   */
  public async createVideo(video: IVideoForm): Promise<Video & VideoPSU> {
    const { status, response, error } = await this.httpService.post(`/videos`, {
      body: video,
    });
    if (status !== StatusCodes.CREATED) {
      throw error;
    }
    return response;
  }

  /**
   * Delete a video
   * @param {string} id the video id
   */
  public async deleteVideo(id: string): Promise<void> {
    const { status, error } = await this.httpService.delete(`/videos/${id}`);
    if (status !== StatusCodes.NO_CONTENT) {
      throw error;
    }
  }

  /**
   * Update a video
   * @param {string} id the video id
   * @param {IVideoForm} data the video form
   * @returns {Promise<Video>}
   */
  public async updateVideo(
    id: string,
    data: IVideoForm
  ): Promise<Video & VideoPSU> {
    const { status, response, error } = await this.httpService.put(
      `/videos/${id}`,
      {
        body: data,
      }
    );
    if (status !== StatusCodes.OK) {
      throw error;
    }
    return response;
  }

  /**
   * Find a video by slug.
   * @param {string} slug the video slug
   * @returns {Promise<Video>}
   */
  public async getVideoBySlug(slug: string): Promise<Video> {
    const { status, response, error } = await this.httpService.get(
      `/videos/${slug}`
    );
    if (status !== StatusCodes.OK) {
      throw error;
    }

    return Video.fromJson(response);
  }

  /**
   * Find youtube video metadata.
   * @param {string} id the youtube video id
   * @returns {Promise<youtube_v3.Schema$Video>}
   */
  public async getVideoMetadata(id: string): Promise<youtube_v3.Schema$Video> {
    const { status, response, error } = await this.httpService.get(
      `/videos/metadata/${id}`
    );
    if (status !== StatusCodes.OK) {
      throw error;
    }

    return response;
  }
}
