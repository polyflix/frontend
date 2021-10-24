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
