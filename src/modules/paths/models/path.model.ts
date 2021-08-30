import { Publisher } from '../../common/models'
import { IPath } from '../types'
import { OrderedCourse } from './orderedCourse.model'

/**
 * Modelize the Path
 * @class Path
 */
export class Path {
  private constructor(
    private readonly _id: string,
    private readonly _title: string,
    private readonly _description: string,
    private readonly _slug: string,
    private readonly _publisherId: string,
    private readonly _publisher: Publisher | null,
    private readonly _courses: OrderedCourse[],
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date
  ) {}

  /**
   * Parse a JSON object to a PathClass instance
   * @param {IPath} json the json to parse
   * @returns {Path} an instance of Path
   */
  static fromJson(json: IPath): Path {
    return new Path(
      json.id,
      json.title,
      json.description,
      json.slug,
      json.publisherId,
      json.publishedBy && Publisher.fromJson(json.publishedBy),
      json.courses?.map((course) => OrderedCourse.fromJson(course)),
      new Date(json.createdAt),
      new Date(json.updatedAt)
    )
  }

  /**
   * Return a path description shortened.
   * @returns {string} the path description shortened
   */
  get shortDescription(): string {
    return this._description.length > 150
      ? this._description.slice(0, 150) + '...'
      : this._description
  }

  /**
   * Return the path id
   * @returns {string} the path id
   */
  get id(): string {
    return this._id
  }

  /**
   * Return the path title
   * @returns {string} the path title
   */
  get title(): string {
    return this._title
  }

  /**
   * Return the slug (UID) of the path.
   * @returns {string} the path slug
   */
  get slug(): string {
    return this._slug
  }

  /**
   * Return the path description.
   * @returns {string} the path description
   */
  get description(): string {
    return this._description
  }

  /**
   * Return the path publisher
   * @returns {pathPublisher} the path publisher
   */
  get publisher(): Publisher | null {
    return this._publisher
  }

  private get link(): string {
    return `/paths/${this._slug}`
  }

  get createdAt(): Date {
    return new Date(this._createdAt)
  }

  /**
   * Return the path information link
   * @returns {string} the path info link
   */
  getInfoLink(): string {
    return this.link
  }

  /**
   * Return the edit link for the path
   * @returns {}
   */
  getEditLink(): string {
    return `/paths/update/${this._slug}`
  }

  /**
   * Return the array of ordered course
   * @returns {OrderedCourse[]}
   */
  getOrderedCourses(): OrderedCourse[] {
    return this._courses
  }

  /**
   * Return the array of ordered course
   * @returns {OrderedCourse[]}
   */
  get courses(): OrderedCourse[] {
    return this._courses
  }
}
