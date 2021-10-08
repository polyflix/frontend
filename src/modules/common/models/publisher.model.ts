import { IPublisher } from '../types'

/**
 * Modelize the VideoPublisher
 * @class VideoPublisher
 */
export class Publisher {
  private constructor(
    private readonly _id: string,
    private readonly _firstName: string,
    private readonly _lastName: string,
    private readonly _profilePicture: string
  ) {}

  /**
   * Parse a JSON object to an instance of VideoPublisher.
   * @param {IPublisher} json the json to parse
   * @returns {VideoPublisher}
   */
  static fromJson(json: IPublisher): Publisher {
    return new Publisher(
      json.id,
      json.firstName,
      json.lastName,
      json.profilePicture
    )
  }

  /**
   * Return the display name of the video publisher.
   * @returns {string} the video publisher display name
   */
  get displayName(): string {
    return `${this.firstName} ${this.lastName}`
  }

  /**
   * Return the first name of the video publisher.
   * @returns {string} the video publisher first name
   */
  get firstName(): string {
    return this._firstName
  }

  /**
   * Return the last name of the video publisher.
   * @returns {string} the video publisher last name
   */
  get lastName(): string {
    return this._lastName
  }

  /**
   * Return the profile picture of the video publisher.
   * @returns {string} the video publisher profile picture
   */
  get profilePicture(): string {
    return this._profilePicture
  }

  /**
   * Return the id of the video publisher.
   * @returns {string} the video published id
   */
  get id(): string {
    return this._id
  }
}
