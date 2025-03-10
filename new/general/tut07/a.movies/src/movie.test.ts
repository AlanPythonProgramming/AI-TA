import request from 'sync-request-curl';
import { port, url } from './config.json';
import type { EmptyObject, MovieAddReturn, MovieListReturn } from './types';


// ============================  REQUEST WRAPPERS  =================================== //

const SERVER_URL = `${url}:${port}`;

const movieAdd = (title: string, director: string): MovieAddReturn => {
  const res = request('POST', SERVER_URL + '/movie/add', { json: {title, director}});
  return JSON.parse(res.body.toString());
};

const movieEdit = (movieId: number, title: string, director: string): EmptyObject => {
  const res = request('PUT', SERVER_URL + `/movie/${movieId}`, { json: { title, director }});
  return JSON.parse(res.body.toString());
};

const moviesList = (): MovieListReturn => {
  const res = request('GET', SERVER_URL + '/movies/list', {});
  return JSON.parse(res.body.toString());
};

const clear = (): EmptyObject => {
  const res = request('DELETE', SERVER_URL + '/clear', {});
  return JSON.parse(res.body.toString());
};


// =================================  TESTS  ======================================== //


beforeEach(() => {
 clear();
});

describe('movieAdd: error and return value', () => {
  test('movieAdd error: Empty title', () => {
    expect(movieAdd('', 'Christopher Nolan')).toStrictEqual({ error: expect.any(String) });
  });

  test('movieAdd has correct return type', () => {
    expect(movieAdd('The Prestige', 'Christopher Nolan')).toStrictEqual({ movieId: expect.any(Number) });
  });
});

describe('movieEdit: error and return value', () => {
  test('invalid id given when no movies have been created', () => {
    expect(movieEdit(999, 'Django Unchained', 'Quentin Tarantino')).toStrictEqual({ error: expect.any(String) });
  });

  describe('With one movie created', () => {
    let movie: MovieAddReturn;
    beforeEach(() => {
      movie = movieAdd('Django Unchained', 'Quentin Tarantino');
    });

    test.each([
      { title: '', director: 'Quentin Tarantino' },
      { title: 'Django Unchained', director: '' },
      { title: '', director: '' },
    ])("Error editing movie with title '$title' and director '$director'", ({ title, director }) => {
      expect(movieEdit(movie.movieId, title, director)).toStrictEqual({ error: expect.any(String) });
    });

    test('invalid id given when one movie exists', () => {
      expect(movieEdit(movie.movieId + 1, 'Encanto', 'Bryan Howard/Jared Bush')).toStrictEqual({ error: expect.any(String) });
    });

    test('valid id, correct empty object return type', () => {
      expect(movieEdit(movie.movieId, 'Encanto', 'Bryan Howard/Jared Bush')).toStrictEqual({});
    });
  });
});

describe('moviesList: testing side effects of movieAdd and movieEdit', () => {
  test('empty movies list', () => {
    expect(moviesList()).toStrictEqual({ movies: [] });
  });

  test('one movie', () => {
    const movie = movieAdd('Django Unchained', 'Quentin Tarantino');
    expect(moviesList()).toStrictEqual({
      movies: [{ movieId: movie.movieId, title: 'Django Unchained', director: 'Quentin Tarantino' }]
    });
  });

  test('multiple movies', () => {
    const movie1 = movieAdd('The Prestige', 'Christopher Nolan');
    const movie2 = movieAdd('Django Unchained', 'Quentin Tarantino');
    const movie3 = movieAdd('Encanto', 'Bryan Howard/Jared Bush');
    expect(moviesList()).toStrictEqual({
      movies: [
        { movieId: movie1.movieId, title: 'The Prestige', director: 'Christopher Nolan' },
        { movieId: movie2.movieId, title: 'Django Unchained', director: 'Quentin Tarantino' },
        { movieId: movie3.movieId, title: 'Encanto', director: 'Bryan Howard/Jared Bush' },
      ]
    });
  });

  test('edited movie have correct details', () => {
    const movie = movieAdd('Django Unchained', 'Quentin Tarantino');
    movieEdit(movie.movieId, 'Encanto', 'Bryan Howard/Jared Bush');
    expect(moviesList()).toStrictEqual({
      movies: [{ movieId: movie.movieId, title: 'Encanto', director: 'Bryan Howard/Jared Bush' }]
    });
  });
});

