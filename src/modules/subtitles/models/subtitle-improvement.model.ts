import { User } from "../../users";
import { ISubtitleImprovement } from "../types/subtitle-improvement.type";
import { SubtitleImprovementMeta } from "./subtitle-improvement-meta.model";

/**
 * Modelize the Video
 * @class Video
 */
export class SubtitleImprovement {
  private constructor(
    private readonly _id: string,
    private readonly _subtitleId: string,
    private readonly _comment: string,
    private readonly _likes: number,
    private readonly _isApproved: boolean,
    private readonly _createdBy: User,
    private readonly _subtitleImprovementMeta: SubtitleImprovementMeta,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date
  ) {}

  /**
   * Parse a JSON object to a VideoClass instance
   * @param {IVideo} json the json to parse
   * @returns {Video} an instance of Video
   */
  static fromJson(json: ISubtitleImprovement): SubtitleImprovement {
    return new SubtitleImprovement(
      json.id,
      json.subtitleId,
      json.comment,
      json.likes,
      json.isApproved,
      json.createdBy,
      json.subtitleImprovementMeta,
      json.createdAt,
      json.updatedAt
    );
  }

  get id(): string {
    return this._id;
  }

  get subtitleId(): string {
    return this._subtitleId;
  }

  get comment(): string {
    return this._comment;
  }

  get likes(): number {
    return this._likes;
  }

  get isApproved(): boolean {
    return this._isApproved;
  }

  get createdBy(): User {
    return this._createdBy;
  }

  get subtitleImprovementMeta(): SubtitleImprovementMeta {
    return this._subtitleImprovementMeta;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
