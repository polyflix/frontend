import { ITag } from '../types/tag.type'

export class Tag {
  private constructor(
    private readonly _id: string,
    private readonly _label: string,
    private readonly _isReviewed: boolean
  ) {}

  static fromJson(json: ITag): Tag {
    return new Tag(json.id, json.label, json.isReviewed)
  }

  get id(): string {
    return this._id
  }

  get label(): string {
    return this._label
  }

  get isReviewed(): boolean {
    return this._isReviewed
  }
}
