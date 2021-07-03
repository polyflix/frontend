import { Publisher } from "../../common/models";
import { ICourse } from "../types";

/**
 * Modelize the Course
 * @class Course
 */
export class Course {
  private constructor(
    private readonly _id: string,
    private readonly _title: string,
    private readonly _content: string,
    private readonly _slug: string,
    private readonly _publisherId: string,
    private readonly _publisher: Publisher | null,
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
      json.slug,
      json.publisherId,
      json.publishedBy && Publisher.fromJson(json.publishedBy),
      new Date(json.createdAt),
      new Date(json.updatedAt)
    );
  }

  /**
   * Return a course content shortened.
   * @returns {string} the video description shortened
   */
  get shortDescription(): string {
    return this._content.length > 150
      ? this._content.slice(0, 150) + "..."
      : this._content;
  }

  /**
   * Return the Course id
   * @returns {string} the Course id
   */
  get id(): string {
    return this._id;
  }

  /**
   * Return the Course title
   * @returns {string} the Course title
   */
  get title(): string {
    return this._title;
  }

  /**
   * Return the slug (UID) of the Course.
   * @returns {string} the Course slug
   */
  get slug(): string {
    return this._slug;
  }

  /**
   * Return the Course content.
   * @returns {string} the Course content
   */
  get content(): string {
    return this._content;
  }

  /**
   * Return the Course publisher
   * @returns {Publisher} the Course publisher
   */
  get publisher(): Publisher | null {
    return this._publisher;
  }

  private get link(): string {
    return `/courses/${this._slug}`;
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
    return `/courses/update/${this._slug}`;
  }
}
