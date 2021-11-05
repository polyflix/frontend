import { useContext } from 'react'

import { IPlayerContext, PlayerContext } from '@videos/contexts/Player.context'

export const usePlayerContext = (): IPlayerContext => {
  const context = useContext<IPlayerContext | undefined>(PlayerContext)
  if (!context) {
    throw new Error(
      'Missing provider. useSubtitlesContext can only be used inside SubtitleProvider.'
    )
  }
  return context
}
