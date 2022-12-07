/**
 * Prepending digit to number
 * @param number value to format
 * @param digits count of digits
 * @returns formated number
 */
export const formatNumber = (number: number, digits = 2): string =>
  number.toLocaleString('en-US', {
    minimumIntegerDigits: digits,
    useGrouping: false,
  })

/**
 * Format milliseconds into HH:MM:SS format
 * @param ms milliseconds
 * @returns formated number HH:MM:SS
 */
export const msToHMS = (ms: number): string => {
  // break if a video is longer than 24 hours
  return new Date(ms).toISOString().slice(11, 19)
}
