import { Injectable } from "@polyflix/di";
import { StatusCodes } from "http-status-codes";
import { HttpService } from "../../common/services/http.service";
import { Video } from "../models/video.model";
import { IVideoForm, VideosWithPagination } from "../types/videos.type";
import { SubtitleService } from "./subtitle.service";

export type VideoParams = {
  page?: number;

  pageSize?: number;

  order?: string;

  slug?: string;

  title?: string;

  authorId?: string;

  isPublished?: boolean;

  isPublic?: boolean;

  joinWithPublisher?: boolean;
};

@Injectable()
export class VideoService {
  constructor(
    private readonly httpService: HttpService,
    private readonly subtitleService: SubtitleService
  ) {}

  /**
   * Get the videos list paginated.
   * @param {number | undefined} authorId the user to get videos from
   * @param {number | undefined} page the page to fetch
   * @param {number | undefined} limit the limit of items per page
   * @returns {Promise<VideosWithPagination>}
   */
  public async getVideos(params: VideoParams): Promise<VideosWithPagination> {
    const { pageSize, page, authorId, isPublic, isPublished } = params;
    const path = "/videos";
    // Build search query
    let query = new URLSearchParams();
    if (page || pageSize) {
      query = new URLSearchParams();
      if (page) query.append("page", page.toString());
      if (pageSize) query.append("pageSize", pageSize.toString());
    }
    if (authorId) query.append("authorId", authorId);
    if (isPublic) query.append("isPublic", isPublic.toString());
    if (isPublished) query.append("isPublished", isPublished.toString());

    // Build the URL for the request.
    // The format is the following : /videos[/me][?page=1&limit=20]
    const url = `${path}${query ? "?" + query.toString() : ""}`;

    const { status, response, error } = await this.httpService.get(url);
    if (status !== 200) {
      throw error;
    }
    return {
      totalCount: response.totalCount,
      items: response.items.map(Video.fromJson),
      // watchedVideos: response.watchedVideos.map(Video.fromJson),
      // watchingVideos: response.watchingVideos.map(Video.fromJson),
    };
  }

  /**
   * Create a video
   * @param {IVideoForm} video the form data to post
   * @returns {Promise<Video>}
   */
  public async createVideo(video: IVideoForm): Promise<Video> {
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
  public async updateVideo(id: string, data: IVideoForm): Promise<Video> {
    const { status, response, error } = await this.httpService.put(
      `/videos/${id}`,
      {
        body: data,
      }
    );
    if (status !== StatusCodes.OK) {
      throw error;
    }
    return Video.fromJson(response);
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
    const subtitles = await this.subtitleService.getSubtitleUrlByVideoId(
      response.id
    );

    return Video.fromJson({ ...response, subtitles });
  }
}
