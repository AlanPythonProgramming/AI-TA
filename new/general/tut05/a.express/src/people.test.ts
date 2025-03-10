import request from 'sync-request-curl';
import { port, url } from './config.json';
import { clear, peopleAdd, peopleList, personView, personEdit, personRemove, peopleStats } from './people';

const SERVER_URL = `${url}:${port}`;

/**
 * Use the imported `request` library to send a request to the server and retrieve a response
 * Documentation:
 * - GitHub: https://github.com/nktnet1/sync-request-curl
 * - NPM: https://www.npmjs.com/package/sync-request-curl
 */

beforeEach(() => {
  clear();
});

describe('clear', () => {
  test('Test successful clear return when empty', () => {
    expect(clear()).toStrictEqual({});
  });
});

describe('peopleAdd', () => {
  test('Test adding successful person return type', () => {
    expect(peopleAdd('hello', 5)).toStrictEqual({ personId: expect.any(Number) });
  });
});

describe('peopleList', () => {
  test('Test getting successful person details', () => {
    const person = peopleAdd('hello', 5);

    expect(peopleList(5)).toStrictEqual({
      people: [
        {
          personId: person.personId,
          name: 'hello',
          age: 5,
        }
      ],
    });
  });
});

describe('personView', () => {
  test('Test successful person view', () => {
    const person = peopleAdd('Tam', 22);
    expect(personView(person.personId)).toStrictEqual({
      person: {
        personId: person.personId,
        name: 'Tam',
        age: 22,
      }
    });
  });
});
