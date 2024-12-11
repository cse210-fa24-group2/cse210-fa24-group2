/**
 * Get all the days in a given month of a specific year.
 * @function getDaysInMonth
 * @param {number} year - The year of the desired month.
 * @param {number} month - The month (0-indexed) to retrieve days for.
 * @returns {Date[]} - An array of Date objects representing each day of the month.
 */
export function getDaysInMonth(year, month) {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

/**
 * Format a date object into a string in YYYY-MM-DD format.
 * @function formatDate
 * @param {Date} date - The date to format.
 * @returns {string} - The formatted date string in ISO format (YYYY-MM-DD).
 */
export function formatDate(date) {
  return date.toISOString().split('T')[0];
}
