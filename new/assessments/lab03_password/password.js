/**
 * NOTE: Tests for the checkPassword should be written first,
 * before implementing the function below.
 * @module password
 */

/**
 * Checks the strength of the given password and returns a string
 * to represent the result.
 *
 * The returned string (in Title Case) is based on the requirements below:
 * - "Strong Password"
 *     - at least 12 characters long
 *     - at least  1 number
 *     - at least  1 uppercase letter
 *     - at least  1 lowercase letter
 *     - at least 1 special character from this list: [!, @, $, %, ^, &, *, +, #]
 *       (this list does NOT include the comma or square brackets)
 * - "Moderate Password"
 *     - at least  10 characters long
 *     - at least  1 letter (upper or lower case)
 *     - at least  1 number
 * - "Horrible Password"
 *     - passwords that are exactly any of the top 5 (not 20) passwords
 *     from the 2025 Nordpass Ranking:
*      - https://en.wikipedia.org/wiki/List_of_the_most_common_passwords
 * - "Poor Password"
 *     - any password that is not horrible, moderate or strong.
 *
 * @param {string} password to check
 * @returns {string} string to indicate the strength of the password.
 */
export function checkPassword(password) {
  /**
   * FIXME
   *
   * Note: your stringformat must match the specification exactly.
   * Please read the specficiation carefully.
   */
  return '';
}

/**
 * Testing will no longer be done in here with console.log.
 * See password.test.js and write Jest tests instead!
 */
