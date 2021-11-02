import { SubtitleLanguages } from '@subtitles/types/subtitle.type'

export enum PolyflixLanguage {
  FR = 'fr',
  EN = 'en',
}

/**
 * As the format of i18n and subtitleLanguage isn't the same
 * We must have an  interface to convert one to the other
 * @param {PolyflixLanguage} polyLang -- Current polyflix language
 */
export const i18nLanguageToSubtitleLanguage = (
  polyLang: PolyflixLanguage
): SubtitleLanguages => {
  switch (polyLang) {
    case PolyflixLanguage.FR:
      return SubtitleLanguages.FR
    case PolyflixLanguage.EN:
      return SubtitleLanguages.EN
  }
}

/**
 * As the format of i18n and subtitleLanguage isn't the same
 * We must have an  interface to convert one to the other
 * @param {SubtitleLanguages} subtitleLang -- Current subtitle language
 */
export const subtitleLanguageToI18nLanguage = (
  subtitleLang: SubtitleLanguages
): PolyflixLanguage => {
  switch (subtitleLang) {
    case SubtitleLanguages.FR:
      return PolyflixLanguage.FR
    case SubtitleLanguages.EN:
      return PolyflixLanguage.EN
  }
}
