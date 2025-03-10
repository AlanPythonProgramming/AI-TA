/**
 * Add type annotations to function parameters and replace all type stubs 'any'.
 *
 * Note: All functions in this lab are pure functions (https://en.wikipedia.org/wiki/Pure_function)
 * You should NOT introduce a "dataStore" or use any global variables in this file.
 */

export interface Madrigal {
  // TODO: add type annotations
  name: any;
  age: any;
  gift?: any;
}

export interface Song {
  // TODO: add type annotations
  name: any;
  singers: any;
}

// TODO: remove 'any' and add type annotations
export function addMadrigal(name: any, age: any, gift? : any): any {
  // TODO: implementation
  return { name: 'John Lennon', age: 40 };
}

// TODO: remove 'any' and add type annotations
export function addSong(name: any, singers: any): any {
  // TODO: implementation
  return { name: 'Something', singers: 'Beatles' };
}

// TODO: add type annotations
export function getNamesMixed(array) {
  // TODO: implementation
  return ['string', 'array'];
}

// TODO: add type annotations
export function getNamesPure(array) {
  // TODO: implementation
  return ['string', 'array'];
}

// TODO: add type annotations
export function checkIsSinger(madrigal, song) {
  // TODO: implementation. Should be a boolean, i.e. true/false
  return null;
}

// TODO: add type annotations
export function getSortedMadrigals(madrigals) {
  // TODO: implementation
  return [];
}

// TODO: add type annotations
export function getSongsWithMadrigals(madrigals, songs) {
  // TODO: implementation
  return [];
}

// TODO: add type annotations
export function getMostSpecialMadrigal(madrigals, songs) {
  // TODO: implementation
  return { name: 'stub code', age: 999, gift: 'potates' };
}
