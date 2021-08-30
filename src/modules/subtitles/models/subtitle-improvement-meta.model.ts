import { ISubtitleImprovementMeta } from '../types/subtitle-improvement-meta.type'

/**
 * Modelize the Video
 * @class Video
 */
export class SubtitleImprovementMeta {
  private constructor(
    private readonly _id: string,
    private _isLiked: boolean,
    private readonly _updatedAt: Date,
    private readonly _createdAt: Date
  ) {}

  /**
   * Parse a JSON object to a VideoClass instance
   * @param {IVideo} json the json to parse
   * @returns {Video} an instance of Video
   */
  static fromJson(json: ISubtitleImprovementMeta): SubtitleImprovementMeta {
    return new SubtitleImprovementMeta(
      json.id,
      json.isLiked,
      json.updatedAt,
      json.createdAt
    )
  }

  get id(): string {
    return this._id
  }

  get isLiked(): boolean {
    return this._isLiked
  }

  set isLiked(status: boolean) {
    this._isLiked = status
  }

  get createdAt(): Date {
    return this._createdAt
  }

  get updatedAt(): Date {
    return this._updatedAt
  }
}
