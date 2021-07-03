import { IPublisher } from "../types";

/**
 * Modelize the Publisher
 * @class Publisher
 */
export class Publisher {
  private constructor(
    private readonly _id: string,
    private readonly _firstName: string,
    private readonly _lastName: string
  ) {}

  /**
   * Parse a JSON object to an instance of Publisher.
   * @param {IPublisher} json the json to parse
   * @returns {Publisher}
   */
  static fromJson(json: IPublisher): Publisher {
    return new Publisher(json.id, json.firstName, json.lastName);
  }

  /**
   * Return the display name of the publisher.
   * @returns {string} the publisher display name
   */
  get displayName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * Return the first name of the publisher.
   * @returns {string} the publisher first name
   */
  get firstName(): string {
    return this._firstName;
  }

  /**
   * Return the last name of the publisher.
   * @returns {string} the publisher last name
   */
  get lastName(): string {
    return this._lastName;
  }

  /**
   * Return the id of the publisher.
   * @returns {string} the published id
   */
  get id(): string {
    return this._id;
  }
}
