import { Block, VttFile } from "@polyflix/vtt-parser";
import { ISubtitle } from "../types/subtitle.type";

export enum SubtitleStatus {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  FAILURE = "FAILURE",
  NOT_FOUND = "NOT_FOUND",
}

export enum SubtitleLanguages {
  FR = "fr-FR",
  EN = "en-US",
}

/**
 * Modelize the subtitle entity
 * @class Subtitle
 */
export class Subtitle {
  private constructor(
    private readonly _id: string,
    private readonly _videoId: string,
    private readonly _lang: SubtitleLanguages,
    private readonly _vttUrl: string,
    private readonly _status: SubtitleStatus,
    private readonly _vttFile: VttFile
  ) {}

  /**
   * Parse a JSON object to a Subtitle class instance
   * @param {ISubtitle} json the json to parse
   * @returns {Subtitle} an instance of Subtitle
   */
  static async fromJson(json: ISubtitle): Promise<Subtitle> {
    let vttFile = null;
    try {
      if (json.status === SubtitleStatus.COMPLETED) {
        vttFile = await VttFile.fromUrl(json.vttUrl);
      } else {
        vttFile = new VttFile("");
      }
      return new Subtitle(
        json.id,
        json.videoId,
        json.lang,
        json.vttUrl,
        json.status,
        vttFile
      );
    } catch (e) {
      return new Subtitle(
        json.id,
        json.videoId,
        json.lang,
        json.vttUrl,
        SubtitleStatus.NOT_FOUND,
        new VttFile("")
      );
    }
  }

  /**
   * Returns the subtitle id
   * @returns {string} the subtitle id
   */
  get id(): string {
    return this._id;
  }

  /**
   * Returns the id of the subtitle's linked video
   * @returns {string} the video id
   */
  get videoId(): string {
    return this._videoId;
  }

  /**
   * Returns the lang of the subtitles
   * @returns {SubtitleLanguages} the lang of the subtitles
   */
  get lang(): SubtitleLanguages {
    return this._lang;
  }

  /**
   * Returns the VTT URL of the subtitles
   * @returns {string} the VTT URL of the subtitles
   */
  get vttUrl(): string {
    return this._vttUrl;
  }

  /**
   * Returns the status of the subtitles
   * @returns {SubtitleStatus} the status of the subtitles
   */
  get status(): SubtitleStatus {
    return this._status;
  }

  /**
   * Returns the vtt file of the subtitles
   * @returns {VttFile} the vtt file of the subtitles
   */
  get vttFile(): VttFile {
    return this._vttFile;
  }

  /**
   * Returns the blocks from the subtitle's vtt file
   * @returns {Block[]} the blocks of subtitle
   */
  getBlocks(): Block[] | undefined {
    return this.vttFile.getBlocks();
  }
}
