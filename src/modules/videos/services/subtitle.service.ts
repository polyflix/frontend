import { StatusCodes } from "http-status-codes";
import { Token } from "../../authentication/models/token.model";
import { HttpService } from "../../common/services/http.service";
import { Injectable } from "@polyflix/di";
import { Subtitle } from "../models/subtitle.model";

@Injectable()
export class SubtitleService {
  constructor(private readonly httpService: HttpService) {}

  /**
   * Find a Subtitle by its video id.
   * @param {string} videoId id of the video
   * @returns {Promise<Subtitle>}
   */
  public async getSubtitleUrlByVideoId(
    token: Token,
    videoId: string
  ): Promise<Subtitle[]> {
    const { status, response, error } = await this.httpService.get(
      `/subtitles?videoId=${videoId}`,
      {
        headers: token.getAuthorizationHeader(),
      }
    );
    if (status !== StatusCodes.OK) {
      throw error;
    }
    return await Promise.all(response.map(Subtitle.fromJson));
  }
}
