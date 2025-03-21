import request, { HttpVerb, Response } from 'sync-request';
import { DEPLOYED_URL } from './submission';

test.todo('Remove this line and uncomment the tests below!');

// ========================================================================= //

/*
// Helpers

const parseResponse = (res: Response, path: string) => {
  let caughtError = 'Unknown error';
  let comp1531Hint = 'No hint available for this error';
  const body = res.body.toString();
  try {
    // Try returning JSON
    const jsonBody = JSON.parse(body);
    if (jsonBody.error !== undefined && ![400].includes(res.statusCode)) {
      caughtError = `Returned error object with status code ${res.statusCode}`;
      comp1531Hint =
        'For lab09_deploy, the only acceptable status code for error cases is 400. ' +
        "Since you returned { error: 'some message' } with a status code other than 400, the test fails";
    } else {
      return jsonBody;
    }
  } catch (e: any) {
    caughtError = e.message;
    if (res.statusCode === 404) {
      caughtError = `Missing route ${path} | ` + caughtError;
      comp1531Hint = `The route '${path}' does not exist on your server (i.e. in server.ts). Check that you do not have any typos and your routes begin with a '/'`;
    } else if (res.statusCode === 500) {
      comp1531Hint =
        'Your server has crashed. Check the terminal running the server to see the error stack trace';
    } else {
      comp1531Hint =
        'Your routes may not be returning a valid JSON response - for example, the /clear should still return an empty object `{}` instead of undefined.';
    }
  }
  const ret = {
    testName: expect.getState().currentTestName,
    returnedBody: body,
    statusCode: res.statusCode,
    caughtError,
    comp1531Hint
  };
  console.log('Logging Error:', ret);
  return ret;
};

const requestHelper = (method: HttpVerb, path: string, payload: object) => {
  let qs = {};
  let json = {};
  if (['GET', 'DELETE'].includes(method)) {
    qs = payload;
  } else {
    // PUT/POST
    json = payload;
  }

  const res = request(method, DEPLOYED_URL + path, { qs, json, timeout: 20000 });
  return parseResponse(res, path);
};

// ========================================================================= //

function clear() {
  return requestHelper('DELETE', '/clear', {});
}

function root() {
  return requestHelper('GET', '/', {});
}

function echo(message: string) {
  return requestHelper('GET', '/echo/echo', { message });
}

function addName(name: string) {
  return requestHelper('POST', '/add/name', { name });
}

function viewNames() {
  return requestHelper('GET', '/view/names', {});
}

// ========================================================================= //

beforeEach(() => {
  clear();
});

afterAll(() => {
  clear();
});

describe('Deployed URL Sanity check', () => {
  test('Looks for exactly one zID in the URL', () => {
    const zIDs = DEPLOYED_URL.match(/z[0-9]{7}/g) || [];

    // URL Sanity test
    expect(zIDs.length).toEqual(1);
    expect(DEPLOYED_URL.startsWith('http')).toBe(true);
    expect(DEPLOYED_URL.endsWith('/')).toBe(false);

    if (process.env.GITLAB_USER_LOGIN) {
      // Pipeline CI test
      expect(zIDs[0]).toEqual(process.env.GITLAB_USER_LOGIN);
    }
  });
});

describe('/', () => {
  test('success', () => {
    expect(root()).toStrictEqual({ message: expect.any(String) });
  });
});

describe('/echo', () => {
  test('success', () => {
    expect(echo('helloworld')).toStrictEqual({ message: 'helloworld' });
  });

  test('failure', () => {
    expect(echo('echo')).toStrictEqual({ error: expect.any(String) });
  });
});

describe('/clear', () => {
  test('return empty', () => {
    expect(clear()).toStrictEqual({});
  });

  test('clear post', () => {
    addName('Hayden');
    expect(viewNames().names.length).toEqual(1);
    expect(clear()).toStrictEqual({});
    expect(viewNames()).toStrictEqual({ names: [] });
  });
});

describe('/add/name', () => {
  describe('errors', () => {
    test.each([{ name: '' }, { name: 'a'.repeat(21) }])(
      "addName('$name') incorrect name length",
      ({ name }) => {
        expect(addName(name)).toStrictEqual({ error: expect.any(String) });
      }
    );
  });

  describe('success', () => {
    test('adding a name', () => {
      expect(addName('Emily')).toStrictEqual({});
    });
  });
});

describe('/view/names', () => {
  test('empty state', () => {
    expect(viewNames()).toStrictEqual({ names: [] });
  });

  test('one name', () => {
    addName('Tam');
    expect(viewNames()).toStrictEqual({ names: ['Tam'] });
  });

  test('multiple names', () => {
    addName('Tam');
    addName('Rani');
    addName('Emily');
    addName('Brendan');
    expect(viewNames()).toEqual({ names: ['Tam', 'Rani', 'Emily', 'Brendan'] });
  });
});

*/
