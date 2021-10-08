import { IAttachment } from '../types/attachments.type'

export class Attachment {
  private constructor(
    private readonly _id: string,
    private readonly _label: string,
    private readonly _url: string
  ) {}

  /**
   * Parse a JSON object to an instance of VideoAttachment.
   * @param {IAttachment} json the json to parse
   * @returns {VideoAttachment}
   */
  static fromJson(json: IAttachment): Attachment {
    return new Attachment(json.id, json.label, json.url)
  }

  /**
   * Return the attachment label.
   * @returns {string} the attachment label
   */
  get label(): string {
    return this._label
  }

  /**
   * Return the url of the attachment
   * @returns {string} the attachment url
   */
  get url(): string {
    return this._url
  }

  /**
   * Return the id of the attachment.
   * @returns {string} the attachment id
   */
  get id(): string {
    return this._id
  }
}
