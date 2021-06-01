import { Injectable } from "@polyflix/di";
import { StatusCodes } from "http-status-codes";
import { HttpService } from "../../common/services/http.service";
import { Subtitle } from "../models/subtitle.model";

@Injectable()
export class SubtitleService {
  constructor(private readonly httpService: HttpService) {}

  /**
   * Find a Subtitle by its video id.
   * @param {string} videoId id of the video
   * @returns {Promise<Subtitle>}
   */
  public async getSubtitleUrlByVideoId(videoId: string): Promise<Subtitle[]> {
    const { status, response, error } = await this.httpService.get(
      `/subtitles?videoId=${videoId}`
    );
    if (status !== StatusCodes.OK) {
      throw error;
    }
    return await Promise.all(response.map(Subtitle.fromJson));
  }
}
