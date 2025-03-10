/**
 * Complete the function below which takes in a year and returns
 * true if it is a leap year and false otherwise.
 * - https://en.wikipedia.org/w/index.php?title=Leap_year&oldid=1130382965#Algorithm_for_Gregorian_leap_year
 *
 * When comparing values, use `===` and `!==` instead of `==` or `!=`.
 * When testing, the 'year' is guaranteed to be a strictly positive integer.
 *
 * @param {number} year - for example, 1999.
 * @returns {boolean} whether the given year is true or false
 */
function isLeap(year) {
  // TODO: return true or false depending on the year, rather than null.
  return null;
}

/**
 * Given an array of strictly positive years, return the number of
 * leap years present.
 *
 * @param {Array<number>} yearArray - for example, [1899, 1904, 1900, 2000]
 * @returns {number} the number of leap years in the given array
 */
function countLeaps(yearArray) {
  // TODO
  return -1;
}

/**
 * Given a strictly positive year, return the closest leap year
 * AFTER the given year.
 *
 * @param {number} year, for example 1999
 * @returns
 */
function getNextLeap(year) {
  return -1;
}

//= ========================================================================= //

/**
 * The code below will be executed when you run this file with
 *     $ node leap.js
 *
 * Feel free to modify the code below to do your own debugging.
 * Any modification will have 0 impact on the automarking
 * (we won't be using this!).
 *
 * You do not need to remove/comment them out when submitting. See
 * the lab specification (README.md) for how to make a lab submission.
 */
console.log();
console.log("======== START ========");
console.log("For the following console.assert debugging, you pass if no 'Assertion failed' is outputted!");

console.log();
console.log('=== Debugging isLeap ===');
console.assert(isLeap(1899) === false, '1899 is not a leap year!');
console.assert(isLeap(1904) === true, '1904 is a leap year!');
console.assert(isLeap(1900) === false, '1900 is a not a leap year!');
console.assert(isLeap(2000) === true, '2000 is a leap year!');

console.log();
console.log('=== Debugging countLeap ===');
console.assert(countLeaps([1899, 1904, 1900, 2000]) === 2, 'There should be 2 leap years!');
console.assert(countLeaps([1899, 1900]) === 0, 'There should be 0 leap years!');
console.assert(countLeaps([4, 400, 4000]) === 3, 'There should be 3 leap years!');

console.log();
console.log('=== Debugging getNextLeap ===');
console.assert(getNextLeap(2000) === 2004, 'Should skip 2000 to 2004!');
console.assert(getNextLeap(1697) === 1704, 'Should be 1704, since 1700 is not a leap year!');

/*
 * Note: If the lines below do not print, and you had to stop the program with
 * Ctrl+C, it is likely that your code is stuck in an infinite loop. This most
 * commonly occurs in a while-loop in the getNextLeap function.
 */
console.log();
console.log("======== FINISH ========");
console.log(`
  NOTE: these console.log messages will have no effect
  on automarking, so you do not need to remove before
  submitting your work.
`)