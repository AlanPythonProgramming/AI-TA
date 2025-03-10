/**
 * NOTE: If you are having difficulty completing this exercise,
 * please take a look at our example in the file "sample.js"!
 */

/**
 * Given an array of fast food restaurants, return a new sorted
 * array in descending order by:
 *
 *   1. valueForMoney
 *   2. taste
 *   3. timeToMake
 *   4. foodVariety
 *   5. customerService
 *   6. name (in lexicographical order, case-insensitive)
 *
 * For example, if two restaurants have the same valueForMoney and taste,
 * the one with a higher timeToMake will be in front 
 * (nearer to the start of the returned array).
 *
 * If the all other fields are equal and the name is compared,
 * "hungry Jacks" will be before "KFC" because "h" is before "K".
 *
 * WARNING: You should NOT modify the order of the original array.
 *
 * @param {
 *   Array<{
 *     name: string,
 *     valueForMoney: number,
 *     taste: number,
 *     timeToMake: number,
 *     foodVariety: number,
 *     customerService: number
 *   }>
 * } fastFoodArray with information about fast food restaurants,
 * which should not be modified.
 * @returns array with the same items, sorted by the key-order given.
 */
function sortedFastFood(fastFoodArray) {
  // TODO: Observe the return type from the stub code
  // FIXME: Replace the stub code with your implementation
  return [
    {
      name: "mcdonalds",
      valueForMoney: 3,
      taste: 3,
      timeToMake: 4,
      foodVariety: 3,
      customerService: 3,
    },
    {
      name: "kfc",
      valueForMoney: 4,
      taste: 3,
      timeToMake: 4,
      foodVariety: 3,
      customerService: 4,
    },
  ];
}

/**
 * Given an array of fast food restaurants, return a new sorted
 * array ranked by the overall satisfaction.
 *
 * The satisfaction of a restaurant is the average score between
 * customerService, foodVariety, valueForMoney, timeToMake and taste.
 *
 * You do not need to round the satisfaction value.
 *
 * If two restaurants have the same satisfaction, the names
 * are compared in lexigraphical order (case-insensitive).
 * For example, "hungry Jacks" will appear before "KFC" because
 * "h" is before "K".
 *
 * WARNING: you should NOT modify the order of the original array.
 *
 * @param {
*   Array<{
*     name: string,
*     valueForMoney: number,
*     taste: number,
*     timeToMake: number,
*     foodVariety: number,
*     customerService: number
*   }>
 * } fastFoodArray with information about fast food restaurants,
 * which should not be modified.
 * @returns {
 *   Array<{
 *     restaurantName: string,
 *     satisfaction: number,
 *   }>
 * } a new sorted array based on satisfaction. The restaurantName
 * will be the same as the original name given.
 */
function sortedSatisfaction(fastFoodArray) {
  // TODO: Observe the return type from the stub code
  // FIXME: Replace the stub code with your implementation
  return [
    {
      restaurantName: 'kentucky',
      satisfaction: 3.6,
    },
    {
      restaurantName: 'maccas',
      satisfaction: 3.2
    }
  ];
}

// ========================================================================= //

/**
 * Execute the file with:
 *     $ node satisfaction.js
 *
 * The expected/sample output for the starter code is in the README.md.
 * Feel free to modify the code below to further test your functions.
 */

// Note: do not use this "fastFoods" global variable directly in your function.
// Your function has the parameter "fastFoodArray".
const fastFoods = [
  {
    name: 'Third fastFood, third satisfaction (4.6)',
    valueForMoney: 5,
    taste: 4,
    timeToMake: 4,
    foodVariety: 5,
    customerService: 5
  },
  {
    // Same as above, but name starts with "S"
    // which is before "T" (case-insensitive)
    name: 'Second fastFood, second satisfaction (4.6)',
    valueForMoney: 5,
    taste: 4,
    timeToMake: 4,
    foodVariety: 5,
    customerService: 5
  },
  {
    // Best foodVariety, and Best overall
    name: 'First fastFood, first satisfaction (4.8)',
    valueForMoney: 5,
    taste: 5,
    timeToMake: 5,
    foodVariety: 4,
    customerService: 5
  },
];

// Note: We are using console.log because arrays cannot be commpared with ===.
// There are better ways to test which we will explore in future weeks :).
console.log('========================');
console.log('1. Testing Fast Food');
console.log('===========');
console.log(sortedFastFood(fastFoods));
console.log();

console.log('========================');
console.log('2. Testing Satisfaction');
console.log('===========');
console.log(sortedSatisfaction(fastFoods));
console.log();

console.log('========================================================');
console.log(`
  TIP:
    after attempting yourself, if you are still stuck, please take a
    look at sample.js in your respository.
`);
console.log(`
  WARNING:
    do not return an array within an array,
      e.g. [[1, 2, 3]] (wrong) instead of [1, 2, 3] (correct).
    You should only see one set of square brackets in the output.
`);
