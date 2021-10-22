import dayjs, { Dayjs } from 'dayjs'

/**
 * A little helper to get the publish label for a date.
 *
 * Return X year(s) ago if the difference between the date and now in year is > 0.
 * Return X month(s) ago if the difference between the date and now in months is > 0
 * Otherwise, returns X day(s) ago.
 *
 * @param date the date as string or directly as a Dayjs instance
 * @returns
 */
export const getPublishLabel = (date?: string | Dayjs): string => {
  if (!date) return 'N/A'

  const now = dayjs()

  date = typeof date === 'string' ? dayjs(date) : date

  const diffInDays = now.diff(date, 'days')
  const diffInMonths = now.diff(date, 'months')
  const diffInYears = now.diff(date, 'years')

  if (diffInYears > 0) {
    return `${diffInYears} year${diffInYears !== 1 && 's'} ago`
  }

  if (diffInMonths > 0) {
    return `${diffInMonths} month${diffInMonths !== 1 && 's'} ago`
  }

  return `${diffInDays} day${diffInDays !== 1 && 's'} ago`
}
