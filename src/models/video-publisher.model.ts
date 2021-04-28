import { IVideoPublisher } from "../types/videos.type";

/**
 * Modelize the VideoPublisher
 * @class VideoPublisher
 */
export default class VideoPublisher {
  private constructor(
    private readonly _firstName: string,
    private readonly _lastName: string
  ) {}

  /**
   * Parse a JSON object to an instance of VideoPublisher.
   * @param {IVideoPublisher} json the json to parse
   * @returns {VideoPublisher}
   */
  static fromJson(json: IVideoPublisher): VideoPublisher {
    return new VideoPublisher(json.firstName, json.lastName);
  }

  /**
   * Return the display name of the video publisher.
   * @returns {string} the video publisher display name
   */
  get displayName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * Return the first name of the video publisher.
   * @returns {string} the video publisher first name
   */
  get firstName(): string {
    return this._firstName;
  }

  /**
   * Return the last name of the video publisher.
   * @returns {string} the video publisher last name
   */
  get lastName(): string {
    return this._lastName;
  }
}
