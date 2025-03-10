import { format } from 'date-fns';
// TODO: add more imports here
import { getChristmas } from 'date-fns-holiday-us';
import promptSync from 'prompt-sync';

/**
 * Given a starting year and an ending year:
 * - If `start` is not at least 325, return an empty array.
 * - If `start` is strictly greater than `end`, return an empty array.
 * - Otherwise, return an array of objects containing information about the halloween,
 * mothers day and christmas date strings in the given (inclusive) range.
 *
 * An example format for christmas in 1970 is
 * - Friday, 25.12.1970
 *
 * @param {number} start - starting year, inclusive
 * @param {number} end - ending year, inclusive
 * @returns {Array<{halloween: string, christmas: string, mothersDay: string}>}
 */
export function holidaysInRange(start, end) {
  // TODO:
  return [
    // Example for start=1970, end=1972
    {
      halloween: 'Saturday, 31.10.1970',
      mothersDay: 'Sunday, 10.05.1970',
      christmas: 'Friday, 25.12.1970'
    },
    {
      halloween: 'Sunday, 31.10.1971',
      mothersDay: 'Sunday, 09.05.1971',
      christmas: 'Saturday, 25.12.1971'
    },
    {
      halloween: 'Tuesday, 31.10.1972',
      mothersDay: 'Sunday, 14.05.1972',
      christmas: 'Monday, 25.12.1972'
    }
  ];
}

/**
 * TODO: Implement the two lines in the "main" function below.
 * This function is imported and called in main.js
 */
export function main() {
  const prompt = promptSync();
  const start = 1970; // FIXME use prompt and parseInt()
  const end = 1972; // FIXME use prompt and parseInt()

  const holidays = holidaysInRange(start, end);
  console.log(holidays);
}


/**
 * Do not call the main function in this file - it is already imported
 * and called in main.js. Please revisit the specificaiton about this.
 */