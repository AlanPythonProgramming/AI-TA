export interface Movie {
  movieId: number;
  title: string;
  director: string;
}

export type EmptyObject = Record<string, never>;

export interface MovieAddReturn {
  movieId: number;
}

export interface MovieListReturn {
  movies: Movie[];
}

export interface ErrorObject {
  error: string;
}
