/**
 * The test suite below uses raw requests to test your server
 *
 * One improvement could be to define helper/wrapper functions
 * to simplify and increase the reusability of your test code
 */

test.todo('Remove this placeholder test and uncomment the tests below!');

/*

import request from 'sync-request-curl';
import { port, url } from './config.json';

const SERVER_URL = `${url}:${port}`;
const TIMEOUT_MS = 5 * 1000;

beforeEach(() => {
  request('DELETE', SERVER_URL + '/clear', { timeout: TIMEOUT_MS });
});

describe('DELETE /clear', () => {
  test('has the correct return type', () => {
    const res = request('DELETE', SERVER_URL + '/clear', { timeout: TIMEOUT_MS });
    expect(JSON.parse(res.body.toString())).toStrictEqual({});
  });
});

describe('POST /admissions/checkin', () => {
  test.each([
    { patientName: '', patientAge: 1 },
    { patientName: 'valid', patientAge: -1 },
  ])('error for patientName="$patientName", patientAge=$patientAge', ({ patientName, patientAge }) => {
    const res = request('POST', SERVER_URL + '/admissions/checkin', { json: { patientName, patientAge }, timeout: TIMEOUT_MS });
    expect(JSON.parse(res.body.toString())).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });

  test('has the correct return type', () => {
    const res = request('POST', SERVER_URL + '/admissions/checkin', { json: { patientName: 'John', patientAge: 23 }, timeout: TIMEOUT_MS });
    expect(JSON.parse(res.body.toString())).toStrictEqual({ admissionId: expect.any(Number) });
  });
});

describe('GET /admissions/list', () => {
  test('error when maxAge is negative', () => {
    const res = request('GET', SERVER_URL + '/admissions/list', { qs: { maxAge: -1 }, timeout: TIMEOUT_MS });
    expect(JSON.parse(res.body.toString())).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });

  test.todo('returns { admissions: [] } when no checkins has occurred');

  test('correctly list one admission', () => {
    const checkinRes = request('POST', SERVER_URL + '/admissions/checkin', { json: { patientName: 'John', patientAge: 23 }, timeout: TIMEOUT_MS });
    const admission = JSON.parse(checkinRes.body.toString());
    const listRes = request('GET', SERVER_URL + '/admissions/list', { qs: { maxAge: 0 }, timeout: TIMEOUT_MS });
    expect(JSON.parse(listRes.body.toString())).toStrictEqual({
      admissions: [
        {
          admissionId: admission.admissionId,
          patientName: 'John',
          patientAge: 23,
          checkinTime: expect.any(Number),
          checkoutTime: null
        }
      ],
    });
  });

  test.todo('correctly list multiple admissions');

  test.todo('correctly filter multiple admissions by maxAge');
});

describe('POST /admissions/:admissionid/checkout', () => {
  test('failed to checkout when no checkins has occurred', () => {
    const res = request('POST', SERVER_URL + '/admissions/0/checkout', { timeout: TIMEOUT_MS });
    expect(JSON.parse(res.body.toString())).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });

  describe('when a valid checkin exists', () => {
    let admission: { admissionId: number };
    beforeEach(() => {
      const res = request('POST', SERVER_URL + '/admissions/checkin', { json: { patientName: 'John', patientAge: 23 }, timeout: TIMEOUT_MS });
      admission = JSON.parse(res.body.toString());
    });

    test('error when checkout with an invalid id', () => {
      const res = request('POST', SERVER_URL + `/admissions/${admission.admissionId + 1}/checkout`, { timeout: TIMEOUT_MS });
      expect(JSON.parse(res.body.toString())).toStrictEqual({ error: expect.any(String) });
      expect(res.statusCode).toStrictEqual(400);
    });

    test.todo('checkout has correct return type');

    test('checkout updates timestamp', () => {
      const listRes1 = request('GET', SERVER_URL + '/admissions/list', { qs: { maxAge: 23 }, timeout: TIMEOUT_MS });
      expect(JSON.parse(listRes1.body.toString())).toStrictEqual({
        admissions: [
          {
            admissionId: admission.admissionId,
            patientName: 'John',
            patientAge: 23,
            checkinTime: expect.any(Number),
            checkoutTime: null
          },
        ]
      });
      request('POST', SERVER_URL + `/admissions/${admission.admissionId}/checkout`, { timeout: TIMEOUT_MS });
      const listRes2 = request('GET', SERVER_URL + '/admissions/list', { qs: { maxAge: 23 }, timeout: TIMEOUT_MS });
      expect(JSON.parse(listRes2.body.toString())).toStrictEqual({
        admissions: [
          {
            admissionId: admission.admissionId,
            patientName: 'John',
            patientAge: 23,
            checkinTime: expect.any(Number),
            checkoutTime: expect.any(Number),
          },
        ]
      });
    });

    test.todo('checkout twice results to 400 error');
  });
});

describe('PUT /admissions/:admissionid', () => {
  test.todo('failed to edit when no checkins has occurred');

  describe('when a valid checkin exists', () => {
    let admission: { admissionId: number };
    beforeEach(() => {
      const res = request('POST', SERVER_URL + '/admissions/checkin', { json: { patientName: 'John', patientAge: 23 }, timeout: TIMEOUT_MS });
      admission = JSON.parse(res.body.toString());
    });

    test.each([
      { patientName: '', patientAge: 1 },
      { patientName: 'valid', patientAge: -1 },
    ])('error updating patientName="$patientName", patientAge=$patientAge', ({ patientName, patientAge }) => {
      const res = request('PUT', SERVER_URL + `/admissions/${admission.admissionId}`, { json: { patientName, patientAge }, timeout: TIMEOUT_MS });
      expect(JSON.parse(res.body.toString())).toStrictEqual({ error: expect.any(String) });
      expect(res.statusCode).toStrictEqual(400);
    });

    test('error when editing with an invalid id', () => {
      const res = request('PUT', SERVER_URL + `/admissions/${admission.admissionId + 1}`, { json: { patientName: 'Edited', patientAge: 999 }, timeout: TIMEOUT_MS });
      expect(JSON.parse(res.body.toString())).toStrictEqual({ error: expect.any(String) });
      expect(res.statusCode).toStrictEqual(400);
    });

    test.todo('editing has correct return type');

    test('editing correctly changes values (side effects)', () => {
      const listRes1 = request('GET', SERVER_URL + '/admissions/list', { qs: { maxAge: 23 }, timeout: TIMEOUT_MS });
      expect(JSON.parse(listRes1.body.toString())).toStrictEqual({
        admissions: [
          {
            admissionId: admission.admissionId,
            patientName: 'John',
            patientAge: 23,
            checkinTime: expect.any(Number),
            checkoutTime: null
          },
        ]
      });
      request('PUT', SERVER_URL + `/admissions/${admission.admissionId}`, { json: { patientName: 'Edited', patientAge: 999 }, timeout: TIMEOUT_MS });
      const listRes2 = request('GET', SERVER_URL + '/admissions/list', { qs: { maxAge: 23 }, timeout: TIMEOUT_MS });
      expect(JSON.parse(listRes2.body.toString())).toStrictEqual({
        admissions: [
          {
            admissionId: admission.admissionId,
            patientName: 'Edited',
            patientAge: 999,
            checkinTime: expect.any(Number),
            checkoutTime: null,
          },
        ]
      });
    });
  });
});

describe('DELETE /admissions/:admissionid', () => {
  test.todo('failed to delete when no checkins has occurred');

  describe('when a valid checkin exists', () => {
    let admission: { admissionId: number };
    beforeEach(() => {
      const res = request('POST', SERVER_URL + '/admissions/checkin', { json: { patientName: 'John', patientAge: 23 }, timeout: TIMEOUT_MS });
      admission = JSON.parse(res.body.toString());
    });

    test.todo('error when deleting with an invalid id');

    test.todo('deleting has correct return type');

    test.todo('deleted admissions will not appear in GET /admissions/list');

    test('deleted admissions will not have their IDs re-used', () => {
      request('DELETE', SERVER_URL + `/admissions/${admission.admissionId}`, { timeout: TIMEOUT_MS });
      const res = request('POST', SERVER_URL + '/admissions/checkin', { json: { patientName: 'John', patientAge: 23 }, timeout: TIMEOUT_MS });
      const newAdmission = JSON.parse(res.body.toString());
      expect(newAdmission).toStrictEqual({ admissionId: expect.any(Number) });
      expect(newAdmission.admissionId).not.toStrictEqual(admission.admissionId);
    });
  });
});

*/
