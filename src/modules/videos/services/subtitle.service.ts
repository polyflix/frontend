import { Injectable } from "@polyflix/di";
import { VttFile } from "@polyflix/vtt-parser";
import { StatusCodes } from "http-status-codes";
import { HttpService } from "../../common/services/http.service";
import { Subtitle, SubtitleStatus } from "../models/subtitle.model";
import { ISubtitle } from "../types";

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
    // return new Subtitle(
    //   json.id,
    //   json.videoId,
    //   json.lang,
    //   vtturl,
    //   SubtitleStatus.COMPLETED,
    //   vttFile
    // );
    const url =
      "http://localhost:9000/subtitles/fr-FR_51735dbe-c8f6-4b0f-8118-634f436ce78b.vtt?Content-Disposition=attachment%3B%20filename%3D%22fr-FR_51735dbe-c8f6-4b0f-8118-634f436ce78b.vtt%22&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minio%2F20210807%2F%2Fs3%2Faws4_request&X-Amz-Date=20210807T160132Z&X-Amz-Expires=432000&X-Amz-SignedHeaders=host&X-Amz-Signature=53e2563a899eca349986b77ecd254449d53ecae0bd0e8292c261fee1178e2399";
    // const url = "http://localhost:9000/subtitles/mock-subtitle.vtt?Content-Disposition=attachment%3B%20filename%3D%22mock-subtitle.vtt%22&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minio%2F20210807%2F%2Fs3%2Faws4_request&X-Amz-Date=20210807T151155Z&X-Amz-Expires=432000&X-Amz-SignedHeaders=host&X-Amz-Signature=869d4ccdf4bb70b281cdf4b49039e74d2e5d5e574577242d28e93abc2ada165b";
    const res = response.map((json: ISubtitle): ISubtitle => {
      return {
        ...json,
        status: SubtitleStatus.COMPLETED,
        vttUrl: url,
      };
    });
    return await Promise.all(res.map(Subtitle.fromJson));
  }

  /**
   * Create subtitles for a video
   * @param {string} videoID
   */
  public async createSubtitle(videoId: string): Promise<void> {
    const { status, error } = await this.httpService.post(`/subtitles`, {
      body: { lang: "fr-FR", videoId: videoId },
    });
    if (status !== StatusCodes.CREATED) {
      throw error;
    }
  }

  /**
   * Delte all subtitles of a video
   * @param {string} videoID
   */
  public async deleteSubtitle(videoId: string): Promise<void> {
    const { status, error } = await this.httpService.delete(`/subtitles`, {
      body: { videoId: videoId },
    });
    if (status !== StatusCodes.NO_CONTENT) {
      throw error;
    }
  }
}
