import { SubtitleLanguages } from '@subtitles/types/subtitle.type'

import { Visibility } from '@core/models/content.model'

export enum Draft {
  True = 'true',
  False = 'false',
}

export interface AdminVideoForm {
  title?: string
  visibility?: Visibility
  draft?: Draft
  availableLanguages: SubtitleLanguages[]
}
