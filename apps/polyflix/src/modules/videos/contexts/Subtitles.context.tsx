import { Subtitle } from '@shared/types/resources/subtitle.model'
import { createContext, PropsWithChildren, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  i18nLanguageToSubtitleLanguage,
  PolyflixLanguage,
} from '@core/utils/language.util'

export type SubtitleState = 'loading' | 'error' | 'success' | 'idle'
export interface ISubtitleContext {
  state: SubtitleState
  subtitles: Subtitle[] | undefined
  currentSubtitle: Subtitle | undefined
  setSubtitles: (subtitles: Subtitle[] | undefined) => void
  setCurrent: (subtitle: Subtitle) => void
  setState: (state: SubtitleState) => void
}

export const SubtitleContext = createContext<ISubtitleContext | undefined>(
  undefined
)

export const SubtitleProvider = ({ children }: PropsWithChildren<{}>) => {
  const [subtitles, setSubtitles] = useState<Subtitle[]>()
  const [state, setState] = useState<SubtitleState>('idle')
  const { i18n } = useTranslation()
  const [currentSubtitle, setCurrentSubtitle] = useState<Subtitle>()

  useEffect(() => {
    if (subtitles) {
      setCurrentSubtitle(
        subtitles.find(
          (subtitle) =>
            subtitle.lang ===
            i18nLanguageToSubtitleLanguage(i18n.language as PolyflixLanguage)
        ) ?? subtitles[0]
      )
    }
  }, [subtitles, i18n.language])

  return (
    <SubtitleContext.Provider
      value={{
        state,
        subtitles,
        currentSubtitle,
        setSubtitles: (subs) => setSubtitles(subs),
        setCurrent: (sub) => setCurrentSubtitle(sub),
        setState: (s) => setState(s),
      }}
    >
      {children}
    </SubtitleContext.Provider>
  )
}
