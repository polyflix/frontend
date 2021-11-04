import dayjs, { Dayjs } from 'dayjs'

import i18n from '../../../i18n/config'

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

  const diffInMinutes = now.diff(date, 'minute')
  const diffInHours = now.diff(date, 'hour')
  const diffInDays = now.diff(date, 'day')
  const diffInMonths = now.diff(date, 'month')
  const diffInYears = now.diff(date, 'year')

  if (diffInYears > 0) {
    return i18n.t('date:date.published.year', { count: diffInYears })
  }
  if (diffInMonths > 0) {
    return i18n.t('date:date.published.month', { count: diffInMonths })
  }
  if (diffInDays > 0) {
    return i18n.t('date:date.published.day', { count: diffInDays })
  }
  if (diffInHours > 0) {
    return i18n.t('date:date.published.hour', { count: diffInHours })
  }
  if (diffInMinutes > 0) {
    return i18n.t('date:date.published.minute', { count: diffInMinutes })
  }
  if (diffInMinutes < 1) {
    return i18n.t('date:date.published.now')
  }
  return 'N/A'
}

export const stringToDate = (date: string): string =>
  dayjs(new Date(date)).format('DD MMM YYYY')
