import { Theme } from '@mui/material'

/**
 * Get the feedback color associated to the score
 * @param scorePercentage the score in percentage
 * @returns
 */
export const getFeebackColor = (scorePercentage: number, theme: Theme) => {
  if (scorePercentage === 0) return theme.palette.divider
  if (scorePercentage >= 75) {
    return theme.palette.success.main
  } else if (scorePercentage >= 25 && scorePercentage < 75) {
    return theme.palette.warning.main
  }
  return theme.palette.error.main
}

/**
 * Convert a score to a percentage
 * @param score the score to convert
 * @param max the maximum
 * @returns the percentage
 */
export const percentage = (score: number, max: number): number =>
  +((score * 100) / max).toFixed(2)
