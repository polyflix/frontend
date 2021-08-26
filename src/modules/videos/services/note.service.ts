import { Injectable } from "@polyflix/di";
import { StatusCodes } from "http-status-codes";
import { HttpService } from "../../common/services/http.service";
import { Note } from "../models/note.model";
import { INote } from "../types/note.type";

@Injectable()
export class NoteService {
  constructor(private readonly httpService: HttpService) {}

  /**
   * Get a note of specific user from selected video
   * @param {string} videoId the video to get note from
   * @returns {Promise<Note>}
   */
  public async getNote(videoId: string): Promise<Note> {
    const { status, response, error } = await this.httpService.get(
      `/notes?videoId=${videoId}`
    );
    if (status !== StatusCodes.OK) {
      throw error;
    }
    return Note.fromJson(response);
  }

  /**
   * Update a note of specific user from selected video
   * @param {string} videoId the video to get note from
   * @param {Note} data mardown content of the note
   * @returns {Promise<void>}
   */
  public async upsertNote(videoId: string, data: INote): Promise<void> {
    const { status, error } = await this.httpService.put(
      `/notes?videoId=${videoId}`,
      {
        body: data,
      }
    );
    if (status !== StatusCodes.OK) {
      throw error;
    }
  }
}
