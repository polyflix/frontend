import { ICollectionPublisher } from "../types";

/**
 * Modelize the CollectionPublisher
 * @class CollectionPublisher
 */
export class CollectionPublisher {
  private constructor(
    private readonly _id: string,
    private readonly _firstName: string,
    private readonly _lastName: string
  ) {}

  /**
   * Parse a JSON object to an instance of CollectionPublisher.
   * @param {ICollectionPublisher} json the json to parse
   * @returns {CollectionPublisher}
   */
  static fromJson(json: ICollectionPublisher): CollectionPublisher {
    return new CollectionPublisher(json.id, json.firstName, json.lastName);
  }

  /**
   * Return the display name of the collection publisher.
   * @returns {string} the collection publisher display name
   */
  get displayName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * Return the first name of the collection publisher.
   * @returns {string} the collection publisher first name
   */
  get firstName(): string {
    return this._firstName;
  }

  /**
   * Return the last name of the collection publisher.
   * @returns {string} the collection publisher last name
   */
  get lastName(): string {
    return this._lastName;
  }

  /**
   * Return the id of the collection publisher.
   * @returns {string} the collection published id
   */
  get id(): string {
    return this._id;
  }
}
