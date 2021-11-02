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
  let seconds: number = ms / 1000
  const hours = Math.round(seconds / 3600)
  seconds = seconds % 3600
  const minutes = Math.round(seconds / 60)
  seconds = seconds % 60
  return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(
    seconds
  )}`
}
