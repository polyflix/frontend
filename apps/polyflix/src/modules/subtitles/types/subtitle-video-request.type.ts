import { SubtitleLanguages } from '@subtitles/types/subtitle.type'

export interface SubtitleVideoRequest {
  /**
   * Complete file name
   */
  name: string
  /**
   * PSU access to file
   */
  accessUrl: string

  language: SubtitleLanguages
}
