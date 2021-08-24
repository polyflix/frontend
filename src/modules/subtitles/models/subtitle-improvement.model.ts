import { User } from "../../users";
import { Subtitle } from "../../videos";
import {
  ISubtitleImprovement,
  SubtitleImprovementStatus,
} from "../types/subtitle-improvement.type";
import { SubtitleImprovementMeta } from "./subtitle-improvement-meta.model";

/**
 * Modelize the Video
 * @class Video
 */
export class SubtitleImprovement {
  private constructor(
    private readonly _subtitle: Subtitle,
    private readonly _comment: string,
    private readonly _timestamp: number,
    private readonly _id?: string,
    private _likes?: number,
    private _isApproved?: boolean,
    private readonly _createdBy?: User,
    private readonly _subtitleImprovementMeta?: SubtitleImprovementMeta,
    private readonly _createdAt?: Date,
    private readonly _updatedAt?: Date,
    private readonly _status?: SubtitleImprovementStatus
  ) {}

  /**
   * Parse a JSON object to a VideoClass instance
   * @param {IVideo} json the json to parse
   * @returns {Video} an instance of Video
   */
  static fromJson(json: ISubtitleImprovement): SubtitleImprovement {
    return new SubtitleImprovement(
      json.subtitle,
      json.comment,
      json.timestamp,
      json.id,
      json.likes,
      json.isApproved,
      json.createdBy,
      json.subtitleImprovementMeta,
      json.createdAt,
      json.updatedAt
    );
  }

  get id(): string {
    return this._id as string;
  }

  get subtitle(): Subtitle {
    return this._subtitle;
  }

  get comment(): string {
    return this._comment;
  }

  get timestamp(): number {
    return this._timestamp;
  }

  get likes(): number {
    return this._likes as number;
  }

  set likes(count: number) {
    this._likes = count;
  }

  get isApproved(): boolean {
    return this._isApproved as boolean;
  }

  set isApproved(status: boolean) {
    this._isApproved = status;
  }

  get createdBy(): User | undefined {
    return this._createdBy;
  }

  get subtitleImprovementMeta(): SubtitleImprovementMeta {
    return this._subtitleImprovementMeta as SubtitleImprovementMeta;
  }

  get createdAt(): Date {
    return new Date(this._createdAt as Date);
  }

  get updatedAt(): Date {
    return new Date(this._updatedAt as Date);
  }

  get status(): SubtitleImprovementStatus {
    return this._status as SubtitleImprovementStatus;
  }
}
