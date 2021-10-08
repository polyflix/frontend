import { Collection } from '../../collections/models'
import { Publisher } from '../../common/models'
import { Visibility } from '../../common/types/crud.type'
import { ICourse } from '../types'

/**
 * Modelize the Course
 * @class Course
 */
export class Course {
  private constructor(
    private readonly _id: string,
    private readonly _title: string,
    private readonly _content: string,
    private readonly _draft: boolean,
    private readonly _visibility: Visibility,
    private readonly _slug: string,
    private readonly _publisherId: string,
    private readonly _publisher: Publisher | null,
    private readonly _collections: Collection[],
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date
  ) {}

  /**
   * Parse a JSON object to a CourseClass instance
   * @param {ICourse} json the json to parse
   * @returns {Course} an instance of Course
   */
  static fromJson(json: ICourse): Course {
    return new Course(
      json.id,
      json.title,
      json.content,
      json.draft,
      json.visibility,
      json.slug,
      json.publisherId,
      json.publishedBy && Publisher.fromJson(json.publishedBy),
      json.collections?.map((collection) => Collection.fromJson(collection)),
      new Date(json.createdAt),
      new Date(json.updatedAt)
    )
  }

  /**
   * Return a course content shortened.
   * @returns {string} the video description shortened
   */
  get shortDescription(): string {
    return this._content.length > 150
      ? this._content.slice(0, 150) + '...'
      : this._content
  }

  /**
   * Return the Course id
   * @returns {string} the Course id
   */
  get id(): string {
    return this._id
  }

  /**
   * Return the Course title
   * @returns {string} the Course title
   */
  get title(): string {
    return this._title
  }

  /**
   * return a string of the enum values
   * @returns {Visibility} string of the value
   */
  get visibility(): Visibility {
    return this._visibility
  }

  /**
   * Return true if the video is a draft, false otherwise
   * @returns {boolean} true if the video is a draft, false otherwise
   */
  get draft(): boolean {
    return this._draft
  }

  /**
   * Return the slug (UID) of the Course.
   * @returns {string} the Course slug
   */
  get slug(): string {
    return this._slug
  }

  /**
   * Return the Course content.
   * @returns {string} the Course content
   */
  get content(): string {
    return this._content
  }

  /**
   * Return the Course publisher
   * @returns {Publisher} the Course publisher
   */
  get publisher(): Publisher | null {
    return this._publisher
  }

  private get link(): string {
    return `/courses/${this._slug}`
  }

  /**
   * Return the Course information link
   * @returns {string} the Course info link
   */
  getInfoLink(): string {
    return this.link
  }

  /**
   * Return the edit link for the Course
   * @returns {}
   */
  getEditLink(): string {
    return `/courses/update/${this._slug}`
  }

  get createdAt(): Date {
    return new Date(this._createdAt)
  }

  /**
   * Return the collection of courses Course
   * @returns {}
   */
  get collections(): Collection[] {
    return this._collections
  }
}
