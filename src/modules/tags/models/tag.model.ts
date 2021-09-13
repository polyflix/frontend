import { ITag } from "../types/tag.type";

export class Tag {
  private constructor(
    private readonly _id: string,
    private readonly _label: string,
    private readonly _isReviewed: boolean,
    private readonly _color: string
  ) {}

  static fromJson(json: ITag): Tag {
    return new Tag(json.id, json.label, json.isReviewed, json.color);
  }

  /**
   * Inverts a color in hexadecimal with the "#" at the beginning
   * @param color The color to invert
   */
  static invertColor(color: string): string {
    let res = (
      parseInt("0x" + color.substring(1, color.length)) ^ 0x00ffffff
    ).toString(16);
    if (res.length === 6) return `#${res}`;
    else {
      while (res.length < 6) {
        res = `0${res}`;
      }
      return `#${res}`;
    }
  }

  get id(): string {
    return this._id;
  }

  get label(): string {
    return this._label;
  }

  get isReviewed(): boolean {
    return this._isReviewed;
  }

  get color(): string {
    return this._color;
  }
}
