import request from 'sync-request-curl';

import { port, url } from './config.json';

const SERVER_URL = `${url}:${port}`;
const ERROR = {error: expect.any(String)}

// ========================================================================= //

// Wrapper functions

const requestClear = (): {} => {
  const res = request('DELETE', SERVER_URL + '/clear', {})
  return JSON.parse(res.body.toString())
}

interface PersonAddReturn {
  personId: number;
}

const requestPeopleAdd = (name: string, age: number): PersonAddReturn => {
  const res = request('POST', SERVER_URL + '/people/addddddddd', { json: { name, age } });
  // Note: it is also possible to extract the status code with res.statusCode,
  // in case we want to return more information than just res.body.
  return JSON.parse(res.body.toString());
};

const requestPeopleList = (minAge: number) => {
  const res = request('GET', SERVER_URL + '/people/list', { qs: { minAge }})
  return JSON.parse(res.body.toString())
}

const requestPersonView = (personId: number) => {
  const res = request('POST', SERVER_URL + `/person/${personId}`, {})
  return JSON.parse(res.body.toString())
}

const requestPersonEdit = (personId: number, name: string, age: number) => {
  const res = request('PUT', SERVER_URL + `/person/:personid`, { json: { personId, name, age } })
  return JSON.parse(res.body.toString())
}

const requestPersonRemove = (personId: number) => {
  const res = request('DELETE', SERVER_URL + `/person/${personId}`, { qs: { personId } })
  return JSON.parse(res.body.toString())
}

const requestPeopleStats = () => {
  const res = request('GET', SERVER_URL + '/people/stats', {})
  return JSON.parse(res.body.toString())
}

// ========================================================================= //

beforeEach(() => {
  requestClear();
});

describe('/people/add', () => {
  describe('error', () => {
    test.each([
      { name: '', age: 20 },
      { name: 'valid', age: 0 },
    ])('name=$name, age=$age', ({ name, age }) => {
      expect(requestPeopleAdd(name, age)).toStrictEqual(ERROR);
    });
  });

  test('return value', () => {
    const person = requestPeopleAdd('valid', 20);
    expect(person).toStrictEqual({ personId: expect.any(Number)});
    expect(requestPeopleList(0)).toStrictEqual({ people: [{ personId: person.personId, name: 'valid', age: 20 }] });
  });
});

describe('/people/list', () => {
  describe('minAge 0', () => {
    test('empty', () => {
      expect(requestPeopleList(0)).toStrictEqual({ people: [] });
    });

    test('one item', () => {
      const { personId } = requestPeopleAdd('one', 1);
      expect(requestPeopleList(0)).toStrictEqual({ people: [{ personId, name: 'one', age: 1 }] });
    });

    test('multiple items', () => {
      const p1 = requestPeopleAdd('alsothree', 3);
      const p2 = requestPeopleAdd('two', 2);
      const p3 = requestPeopleAdd('one', 1);
      const p4 = requestPeopleAdd('three', 3);
      expect(requestPeopleList(0)).toStrictEqual({
        people:
          [
            { personId: p1.personId, name: 'alsothree', age: 3 },
            { personId: p4.personId, name: 'three', age: 3 },
            { personId: p2.personId, name: 'two', age: 2 },
            { personId: p3.personId, name: 'one', age: 1 },
          ]
      });
    });
  });

  describe('with minAge', () => {
    test('error: minAge negative', () => {
      requestPeopleAdd('three', 3);
      expect(requestPeopleList(-1)).toStrictEqual(ERROR);
    });

    test('higher minAge than existing people means empty', () => {
      requestPeopleAdd('three', 3);
      expect(requestPeopleList(4)).toStrictEqual({ people: [] });
    });

    test('minAge filter', () => {
      requestPeopleAdd('three', 3);
      const p2 = requestPeopleAdd('five', 5);
      expect(requestPeopleList(4)).toStrictEqual({ people: [{ personId: p2.personId, name: 'five', age: 5 }] });
    });
  });
});

describe('GET /person/:personid', () => {
  let person: PersonAddReturn;
  beforeEach(() => {
    person = requestPeopleAdd('Tam', 22);
  });
  describe('error', () => {
    test('does not exist', () => {
      expect(requestPersonView(person.personId + 1)).toStrictEqual(ERROR);
    });
  });
  describe('success', () => {
    test('valid view', () => {
      expect(requestPersonView(person)).toStrictEqual({
        person: {
          personId: person.personId,
          name: 'Tam',
          age: 22,
        }
      });
    });
  });
});

describe('PUT /person/:personid', () => {
  let person: PersonAddReturn;
  beforeEach(() => {
    person = requestPeopleAdd('Tam', 22);
  });
  describe('error', () => {
    test('does not exist', () => {
      expect(requestPersonEdit(person.personId + 1, 'invalid', 20)).toStrictEqual(ERROR);
    });

    test('negative age', () => {
      expect(requestPersonEdit(person.personId, 'valid', -20)).toStrictEqual(ERROR);
    });

    test('empty name', () => {
      expect(requestPersonEdit(person.personId, '', 20)).toStrictEqual(ERROR);
    });

    test('name already taken', () => {
      requestPeopleAdd('Rani', 22);
      expect(requestPersonEdit(person.personId, 'Rani', 20)).toStrictEqual(ERROR);
    });
  });

  test('successful edit', () => {
    expect(requestPeopleList(0)).toStrictEqual({ people: [{ personId: person.personId, name: 'Tam', age: 22 }] });
    expect(requestPersonEdit(person.personId, 'valid', 20)).toStrictEqual({});
    expect(requestPeopleList(0)).toStrictEqual({ people: [{ personId: person.personId, name: 'valid', age: 20 }] });
  });

  test('editing just age is okay', () => {
    expect(requestPeopleList(0)).toStrictEqual({ people: [{ personId: person.personId, name: 'Tam', age: 22 }] });
    expect(requestPersonEdit(person.personId, 'Tam', 20)).toStrictEqual({});
    expect(requestPeopleList(0)).toStrictEqual({ people: [{ personId: person.personId, name: 'Tam', age: 20 }] });
  });
});

describe('DELETE person/:personid', () => {
  let person: PersonAddReturn;
  beforeEach(() => {
    person = requestPeopleAdd('Tam', 22);
  });
  describe('error', () => {
    test('does not exist', () => {
      expect(requestPersonRemove(person.personId + 1)).toStrictEqual(ERROR);
    });

    test('double remove', () => {
      expect(requestPersonRemove(person.personId)).toStrictEqual({});
      expect(requestPersonRemove(person.personId)).toStrictEqual(ERROR);
    });
  });

  test('successful remove', () => {
    expect(requestPeopleList(0)).toStrictEqual({ people: [{ personId: person.personId, name: 'Tam', age: 22 }] });
    requestPersonRemove(person.personId);
    expect(requestPeopleList(0)).toStrictEqual({ people: [] });
  });
});

describe('/getstats', () => {
  describe('error', () => {
    test('empty data', () => {
      expect(requestPeopleStats()).toStrictEqual(ERROR);
    });
  });

  test('single entry', () => {
    requestPeopleAdd('valid', 10);
    expect(requestPeopleStats()).toStrictEqual({
      stats: {
        minAge: 10,
        maxAge: 10,
        averageAge: 10,
      }
    });
  });

  test('multiple entries', () => {
    requestPeopleAdd('one', 1);
    requestPeopleAdd('five', 5);
    requestPeopleAdd('three', 3);
    requestPeopleAdd('two', 2);
    requestPeopleAdd('four', 4);
    expect(requestPeopleStats()).toStrictEqual({
      stats: {
        minAge: 1,
        maxAge: 5,
        averageAge: 3,
      }
    });
  });
});

describe('clear', () => {
  test('clear on empty', () => {
    expect(requestClear()).toStrictEqual({});
  });

  test('clear success', () => {
    requestPeopleAdd('one', 1);
    expect(requestClear()).toStrictEqual({});
    expect(requestPeopleList(0)).toStrictEqual({ people: [] });
  });
});
