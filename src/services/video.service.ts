import { StatusCodes } from "http-status-codes";
import { Token } from "../models/token.model";
import Video from "../models/video.model";
import { IVideoForm, VideosWithPagination } from "../types/videos.type";
import { DELETE, GET, PATCH, POST } from "../utils/api.util";

export class VideoService {
  /**
   * Get the videos list paginated.
   * @param {number | undefined} page the page to fetch
   * @param {number | undefined} limit the limit of items per page
   * @param {Token | undefined} token the access token
   * @returns {Promise<VideosWithPagination>}
   */
  static async getVideos(
    page?: number,
    limit?: number,
    token?: Token
  ): Promise<VideosWithPagination> {
    const path = `/videos${token ? "/me" : ""}`;
    // Build search query
    let query;
    if (page || limit) {
      query = new URLSearchParams();
      if (page) query.append("page", page.toString());
      if (limit) query.append("limit", limit.toString());
    }

    // Build the URL for the request.
    // The format is the following : /videos[/me][?page=1&limit=20]
    const url = `${path}${query ? "?" + query.toString() : ""}`;

    const { status, response, error } = await GET(url, {
      // If we have a token, we put it into the headers for the request
      headers: token ? token.getAuthorizationHeader() : {},
    });
    if (status !== 200) {
      throw error;
    }
    return {
      pages: response.totalPages,
      videos: response.videos.map(Video.fromJson),
    };
  }

  /**
   * Create a video
   * @param {IVideoForm} video the form data to post
   * @param {Token} token the access token
   * @returns {Promise<Video>}
   */
  static async createVideo(video: IVideoForm, token: Token): Promise<Video> {
    const { status, response, error } = await POST(`/videos`, {
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
  static async deleteVideo(id: string, token: Token): Promise<void> {
    const { status, error } = await DELETE(`/videos/${id}`, {
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
  static async updateVideo(
    id: string,
    data: IVideoForm,
    token: Token
  ): Promise<Video> {
    const { status, response, error } = await PATCH(`/videos/${id}`, {
      body: data,
      headers: token.getAuthorizationHeader(),
    });
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
  static async getVideoBySlug(slug: string): Promise<Video> {
    const { status, response, error } = await GET(`/videos/${slug}`);
    if (status !== StatusCodes.OK) {
      throw error;
    }
    return Video.fromJson(response);
  }
}
