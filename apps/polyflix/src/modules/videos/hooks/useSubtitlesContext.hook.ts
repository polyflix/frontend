import { useContext } from 'react'

import {
  ISubtitleContext,
  SubtitleContext,
} from '@videos/contexts/Subtitles.context'

export const useSubtitlesContext = (): ISubtitleContext => {
  const context = useContext<ISubtitleContext | undefined>(SubtitleContext)
  if (!context) {
    throw new Error(
      'Missing provider. useSubtitlesContext can only be used inside SubtitleProvider.'
    )
  }
  return context
}
