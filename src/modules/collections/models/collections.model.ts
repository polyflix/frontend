import { ICollection } from "../types";
import { CollectionPublisher } from "./collection-publisher.model";
import { Video } from "../../videos/models/video.model";

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
    private readonly _publisher: CollectionPublisher | null,
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
      json.publishedBy && CollectionPublisher.fromJson(json.publishedBy),
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
   * Return the collection videos.
   * @returns {Video[]} the collection videos
   */
  get videos(): Video[] {
    return this._videos;
  }

  /**
   * Return the collection publisher
   * @returns {VideoPublisher} the collection publisher
   */
  get publisher(): CollectionPublisher | null {
    return this._publisher;
  }
}
