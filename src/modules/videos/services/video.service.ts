import { StatusCodes } from "http-status-codes";
import { Token } from "../../authentication/models/token.model";
import { HttpService } from "../../common/services/http.service";
import { Injectable } from "@polyflix/di";
import { Video } from "../models/video.model";
import { IVideoForm, VideosWithPagination } from "../types/videos.type";

@Injectable()
export class VideoService {
  constructor(private readonly httpService: HttpService) {}

  /**
   * Get the videos list paginated.
   * @param {Token} token the access token
   * @param {number | undefined} authorId the user to get videos from
   * @param {number | undefined} page the page to fetch
   * @param {number | undefined} limit the limit of items per page
   * @returns {Promise<VideosWithPagination>}
   */
  public async getVideos(
    token: Token,
    authorId?: string,
    page?: number,
    pageSize?: number
  ): Promise<VideosWithPagination> {
    const path = "/videos";
    // Build search query
    let query = new URLSearchParams();
    if (page || pageSize) {
      query = new URLSearchParams();
      if (page) query.append("page", page.toString());
      if (pageSize) query.append("pageSize", pageSize.toString());
    }
    if (authorId) query.append("authorId", authorId);

    // Build the URL for the request.
    // The format is the following : /videos[/me][?page=1&limit=20]
    const url = `${path}${query ? "?" + query.toString() : ""}`;

    const { status, response, error } = await this.httpService.get(url, {
      // If we have a token, we put it into the headers for the request
      headers: token.getAuthorizationHeader(),
    });
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
   * @param {Token} token the access token
   * @returns {Promise<Video>}
   */
  public async createVideo(video: IVideoForm, token: Token): Promise<Video> {
    const { status, response, error } = await this.httpService.post(`/videos`, {
      body: video,
      headers: token.getAuthorizationHeader(),
    });
    if (status !== StatusCodes.CREATED) {
      throw error;
    }
    return response;
  }

  /**
   * Delete a video
   * @param {string} id the video id
   * @param {Token} token the access token
   */
  public async deleteVideo(id: string, token: Token): Promise<void> {
    const { status, error } = await this.httpService.delete(`/videos/${id}`, {
      headers: token.getAuthorizationHeader(),
    });
    if (status !== StatusCodes.NO_CONTENT) {
      throw error;
    }
  }

  /**
   * Update a video
   * @param {string} id the video id
   * @param {IVideoForm} data the video form
   * @param {Token} token the access token
   * @returns {Promise<Video>}
   */
  public async updateVideo(
    id: string,
    data: IVideoForm,
    token: Token
  ): Promise<Video> {
    const { status, response, error } = await this.httpService.put(
      `/videos/${id}`,
      {
        body: data,
        headers: token.getAuthorizationHeader(),
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
  public async getVideoBySlug(token: Token, slug: string): Promise<Video> {
    const { status, response, error } = await this.httpService.get(
      `/videos/${slug}`,
      {
        headers: token.getAuthorizationHeader(),
      }
    );
    if (status !== StatusCodes.OK) {
      throw error;
    }
    return Video.fromJson(response);
  }
}
