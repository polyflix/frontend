/**
 * Format your date into the english defined format YYYY-mm-dd
 * @param {Date} date
 */
export const formatEnglish = (date: Date) => {
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
};
