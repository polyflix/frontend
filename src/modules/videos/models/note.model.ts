import { INote } from '../types/note.type'

/**
 * Modelize a note
 * @class Note
 */
export class Note {
  private constructor(private _content: string) {}

  /**
   * Parse a JSON object to a Note instance
   * @param {IVideo} json the json to parse
   * @returns {Video} an instance of Video
   */
  static fromJson(json: INote): Note {
    return new Note(json.content)
  }

  get content(): string {
    return this._content
  }

  set content(newContent: string) {
    this._content = newContent
  }
}
