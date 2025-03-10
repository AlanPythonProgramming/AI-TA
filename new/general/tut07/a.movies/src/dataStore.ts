import type { Movie } from './types';

interface DataStore {
  movies: Movie[];
}

let dataStore: DataStore = {
  movies: [],
};

export function getData(): DataStore {
  return dataStore;
}
