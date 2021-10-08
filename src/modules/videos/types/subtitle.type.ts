import { AlertType } from '../../ui/components/Alert/Alert.component'
import { Video } from '../models'
import { SubtitleLanguages, SubtitleStatus } from '../models/subtitle.model'

export type SubtitleState<T> = {
  isLoading: boolean
  data: T | null
  alert: { type: AlertType; message: string } | null
  triggerReload: () => void
}

export interface ISubtitle {
  id: string
  video?: Video
  lang: SubtitleLanguages
  vttUrl: string
  status: SubtitleStatus
}
