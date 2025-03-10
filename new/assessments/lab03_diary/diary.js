/**
 * Defines a global datastore object. This is an implementation detail (blackboxed from your tests)
 * This means that you should NOT export this object or use it in your tests directly.
 *
 * You can remove/modify/edit the object as you wish. For example, changing `const` to `let`, adding
 * new properties, use a different data structure (e.g. a Map instead of an object), etc.
 */
const diary = {
  entries: [],
}

/**
 * Clear all diary entries in the global datastore and returns an empty object.
 * If you have added new properties or otherwise modified the initial diary
 * datastore, you will need to update this function accordingly.
 *
 * @returns {{}}
 */
export function clear() {
  diary.entries = [];
  return {};
}


/**
 * Add a new diary entry to the global datastructure
 *
 * @param {string} title
 * @param {string} content
 * @returns {{ entryId: number} | { error: string }}
 */
export function addDiaryEntry(title, content) {
  /*
  // A sample implementation of this function has been added
  // below for reference. You can use it as is, modify it to
  // hold different information in your "diary" global data
  // store or rewrite it completely if you wish.

  if (!title) {
    return { error: 'No title provided' };
  }

  if (!content) {
    return { error: 'No content provided' };
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const entryId = diary.entries.length;
  const newEntry = {
    entryId,
    title,
    content,
    timestamp,
  }
  diary.entries.push(newEntry);
  return { entryId }
  */

  // FIXME: add implementation
  return null;
}


/**
 * Returns the full detail of a diary entry corresponding to the input id.
 * @param {number} entryId
 * @returns {{ entry: { entryId: number, title: string, content: string, timestamp: number }}}
 */
export function viewDiaryEntry(entryId) {
  // FIXME: return the correct entry object.
  return null;
}


/**
 * List brief details about all diary entries
 * (please review the specification data types for what this includes)
 *
 * The most recently created entries should appear first, i.e. [e3, e2, e1]
 *
 * No additional information should be provided.
 *
 * @returns {{ entries: { entryId: number, title: string }[] }}
 */
export function listDiaryEntries() {
  // FIXME: return an object of the form: { entries: [{ entryId: 1, title: 'some title' }] };
  // NOTE: The most recently created entries should appear first, i.e. [e3, e2, e1]
  return null;
}


/**
 * Edits the title and content of a diary entry. You do not need to
 * update the timestamp.
 *
 * @param {number} entryId
 * @param {string} title
 * @param {string} content
 * @returns {{}}
 */
export function editDiaryEntry(entryId, title, content) {
  // FIXME: add implementation and return an empty object, {}, instead of null
  return null;
}


/**
 * Search through the diary for all entries whose title or content
 * contains the given substring. 
 * 
 * @param {*} substring 
 * @param {*} titleOnly 
 * @returns {{ entries: { entryId: number, title: string }[] }}
 */
export function searchDiary(substring, titleOnly) {
  // FIXME: return an object of the form: { entries: [{ entryId: 1, title: 'some title' }] };
  return null;
}

/**
 * DO NOT ADD console.log TO TEST YOUR CODE HERE.
 * Please write Jest tests in the file diary.test.js provided.
 */
