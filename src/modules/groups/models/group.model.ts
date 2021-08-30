/**
 * The class Group represent a Group in the front-end.
 * @class Group
 */
import { IGroup } from '../types/groups.type'
import { Member } from './member.model'

export class Group {
  private constructor(
    private readonly _id: number,
    private readonly _title: string,
    private readonly _description: string,
    private readonly _slug: string,
    private readonly _owner: string,
    private readonly _members: Member[]
  ) {}

  /**
   * Parse a JSON response into a Griyo class instance.
   * @param {IGroup} json
   * @returns {Group} a group instance
   */
  static fromJson(json: IGroup): Group {
    return new Group(
      json.id,
      json.title,
      json.description,
      json.slug,
      json.owner,
      json.members ? json.members.map(Member.fromJson) : []
    )
  }

  /**
   * Return the id of the group.
   * @returns {number} the id of the group
   */
  get id(): number {
    return this._id
  }

  /**
   * Return the title of the group
   * @returns {string} the group title
   */
  get title(): string {
    return this._title
  }

  /**
   * Return the description of the group
   * @returns {string} the group description
   */
  get description(): string {
    return this._description
  }

  /**
   * Return the description of the group
   * @returns {string} the group slug
   */
  get slug(): string {
    return this._slug
  }

  /**
   * Return the members of the group
   * @returns {Group[]} the group members
   */
  get members(): Member[] {
    return this._members
  }

  /**
   * Return the edit link of the group
   * @returns {string} the group link
   */
  get editLink(): string {
    return `/groups/update/${this._slug}`
  }
}
