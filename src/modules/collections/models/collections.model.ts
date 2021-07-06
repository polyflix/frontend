import { ICollection } from "../types";
import { Video } from "../../videos/models/video.model";
import { Publisher } from "../../common/models";

/**
 * Modelize the Collection
 * @class Collection
 */
export class Collection {
  private constructor(
    private readonly _id: string,
    private readonly _title: string,
    private readonly _description: string,
    private readonly _slug: string,
    private readonly _publisherId: string,
    private readonly _availability: string,
    private readonly _publisher: Publisher | null,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
    private readonly _videos: Video[]
  ) {}

  /**
   * Parse a JSON object to a CollectionClass instance
   * @param {ICollection} json the json to parse
   * @returns {Collection} an instance of Collection
   */
  static fromJson(json: ICollection): Collection {
    return new Collection(
      json.id,
      json.title,
      json.description,
      json.slug,
      json.publisherId,
      json.availability,
      json.publishedBy && Publisher.fromJson(json.publishedBy),
      new Date(json.createdAt),
      new Date(json.updatedAt),
      json.videos && json.videos.map((video) => Video.fromJson(video))
    );
  }

  /**
   * Return a collection description shortened.
   * @returns {string} the collection description shortened
   */
  get shortDescription(): string {
    return this._description.length > 150
      ? this._description.slice(0, 150) + "..."
      : this._description;
  }

  /**
   * Return the collection id
   * @returns {string} the collection id
   */
  get id(): string {
    return this._id;
  }

  /**
   * Return the collection title
   * @returns {string} the collection title
   */
  get title(): string {
    return this._title;
  }

  /**
   * Return the slug (UID) of the collection.
   * @returns {string} the collection slug
   */
  get slug(): string {
    return this._slug;
  }

  /**
   * Return the collection description.
   * @returns {string} the collection description
   */
  get description(): string {
    return this._description;
  }

  /**
   * Return the collection availability.
   * @returns {string} the collection availability
   */
  get availability(): string {
    return this._availability;
  }

  /**
   * Return the collection videos.
   * @returns {Video[]} the collection videos
   */
  get videos(): Video[] {
    return this._videos;
  }

  /**
   * Return the collection publisher
   * @returns {Publisher} the collection publisher
   */
  get publisher(): Publisher | null {
    return this._publisher;
  }

  private get link(): string {
    return `/collections/${this._slug}`;
  }

  /**
   * Return the Course information link
   * @returns {string} the Course info link
   */
  getInfoLink(): string {
    return this.link;
  }

  /**
   * Return the edit link for the Course
   * @returns {}
   */
  getEditLink(): string {
    return `/collections/update/${this._slug}`;
  }

  get createdAt(): Date {
    return new Date(this._createdAt);
  }
}
