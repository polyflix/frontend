import { Course } from '../../courses/models'
import { IOrderedCourse } from '../types'

/**
 * Modelize the Path
 * @class Path
 */
export class OrderedCourse {
  private constructor(
    private readonly _id: string,
    private readonly _order: number,
    private readonly _course: Course
  ) {}

  /**
   * Parse a JSON object to a OrederedCourseClass instance
   * @param {IOrderedCourse} json the json to parse
   * @returns {OrderedCourse} an instance of Path
   */
  static fromJson(json: IOrderedCourse): OrderedCourse {
    return new OrderedCourse(json.id, json.order, Course.fromJson(json.course))
  }

  /**
   * Return the ordered course id
   * @returns {string} the ordered course id
   */
  get id(): string {
    return this._id
  }

  /**
   * Return the order value of the course
   * @returns {number}
   */
  get order(): number {
    return this._order
  }

  /**
   * Return the course
   * @returns {Course} the course
   */
  get course(): Course {
    return this._course
  }
}
