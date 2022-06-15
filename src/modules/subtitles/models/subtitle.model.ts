import { SubtitleLanguages } from '@subtitles/types/subtitle.type'

import { VttFile } from '@polyflix/vtt-parser'

import { Video } from '@videos/models/video.model'

export interface Subtitle {
  lang: SubtitleLanguages
  vttUrl: string
  vttFile: VttFile
  id?: string
  video?: Video
}

export interface SubtitleResponse {
  language: SubtitleLanguages
  accessUrl: string
}

export interface SubtitlesResponse {
  subtitles: [{ id: string; language: SubtitleLanguages }]
  videoSlug: string
}
