import { Theme } from '@mui/material'
import { max } from 'lodash'

import { Quizz } from '@quizzes/models/quizz.model'

/**
 * Get the feedback color associated to the score
 * @param scorePercentage the score in percentage
 * @returns
 */
export const getFeedbackColor = (scorePercentage: number, theme: Theme) => {
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
export const percentage = (score: number, maximum: number): number =>
  +((score * 100) / maximum).toFixed(2)

/**
 * Compute the score of an user for a quizz.
 * @param quizz
 */
export const getScore = (quizz: Quizz) => {
  const attempts = quizz.attempts || []
  if (attempts.length <= 0) return 0

  // If the quizz is configured to keep the highest score
  // We should return the max score obtained by the user
  if (quizz.keepHighestScore) {
    return max(attempts.map(({ score }) => score))
  }

  return +(
    attempts.map(({ score }) => score).reduce((acc, value) => acc + value, 0) /
    attempts.length
  )
}
