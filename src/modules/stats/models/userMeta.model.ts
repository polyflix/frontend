import { IWatchMetadata } from "../types/userMeta.type";

export default class WatchMetadata {
  /**
   * @param {number} _watchedSeconds -- Watched seconds of the video
   * @param {number} _watchedPercent -- Watched percentage of the video
   * @param {boolean} _isWatched -- Is already watched (depending backend strategy)
   * @param {string} _updatedAt -- Datetime
   * @param {string} _createdAt -- Datetime
   * @private
   */
  private constructor(
    private readonly _watchedSeconds: number,
    private readonly _watchedPercent: number,
    private readonly _isWatched: boolean,
    private readonly _updatedAt: string,
    private readonly _createdAt: string
  ) {}

  static fromJson(json: IWatchMetadata): WatchMetadata {
    return new WatchMetadata(
      json.watchedSeconds,
      json.watchedPercent,
      json.isWatched,
      json.updatedAt,
      json.createdAt
    );
  }

  get watchedSeconds(): number {
    return this._watchedSeconds;
  }

  get watchedPercent(): number {
    return this._watchedPercent;
  }

  get isWatched(): boolean {
    return this._isWatched;
  }

  get updatedAt(): string {
    return this._updatedAt;
  }

  get createdAt(): string {
    return this._createdAt;
  }
}
