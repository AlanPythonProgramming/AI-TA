import { getData } from './dataStore';
import type { EmptyObject, ErrorObject, MovieAddReturn, MovieListReturn } from './types';

export function clear(): EmptyObject {
  getData().movies = [];
  return {};
}

export function movieAdd(title: string, director: string): MovieAddReturn | ErrorObject {
  if (title === '' || director === '') {
    // FIXME: change to throw error
    return { error: `Title '${title}' or director ${director} is empty` };
  }
  const data = getData();
  const movieId = data.movies.length;
  data.movies.push({ movieId, title, director });
  return { movieId };
}

export function movieEdit(movieId: number, title: string, director: string): EmptyObject | ErrorObject {
  const movie = getData().movies.find(m => m.movieId === movieId);
  if (movie === undefined) {
    // FIXME: change to throw error
    return { error: `No existing movie with movieId: ${movieId}` };
  }
  if (title === '' || director === '') {
    // FIXME: change to throw error
    return { error: `Title '${title}' or director ${director} is empty` };
  }
  movie.title = title;
  movie.director = director;
  return {};
}

export function moviesList(): MovieListReturn {
  return { movies: getData().movies };
}
