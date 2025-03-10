import fs from 'fs';
import { InputError } from './errors';
export const DATABASE_FILE = 'database.json';
const MAX_LENGTH = 20;
const MIN_LENGTH = 1;

// ========================================================================== //

type Data = {
  names: string[];
};

let dataStore: Data = {
  names: []
};

// ========================================================================== //
/**
 * HELPER FUNCTIONS

 * If there are multiple files that uses these functions, rather than redefining
 * them in each new file, it is better to move these helper functions into a
 * file of its own such as src/helper.ts, then export and import into other files.
 */

const getData = () => {
  return dataStore;
};

export const setData = (newData: Data) => {
  dataStore = newData;
  // Update our persistent data store with any data changes
  fs.writeFileSync(DATABASE_FILE, JSON.stringify(dataStore));
};

const checkValidName = (name: string): boolean => {
  return !(name.length < MIN_LENGTH || name.length > MAX_LENGTH);
};

// ========================================================================== //

// POST /add/name: (name: string) => {}
export function addName(name: string): Record<never, never> {
  if (!checkValidName(name)) {
    throw new InputError(
      'For our reference solution, we have restricted the length of the name' +
        ` to be between '${MIN_LENGTH}' and '${MAX_LENGTH}' characters.`
    );
  }
  const data = getData();
  data.names.push(name);
  setData(data);
  return {};
}

// GET /view/names: () => { names:  ['Adam', 'Ben', 'Carl'] }
export function viewNames(): { names: string[] } {
  const data = getData();
  return { names: data.names };
}

export function clear(): Record<never, never> {
  const data = getData();
  data.names = [];
  setData(data);
  return {};
}
