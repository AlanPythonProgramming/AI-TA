test.todo('Remove this test and uncomment the tests further below');

/*
// Notice how we are only importing the functions listed from the specification, and not
// our underlying "diary" object. To keep our tests black-box, we must only test the
// known input and output that are explicitly specified (no more, no less).

import {
  addDiaryEntry,
  clear,
  editDiaryEntry,
  listDiaryEntries,
  searchDiary,
  viewDiaryEntry
} from './diary';

beforeEach(() => {
  // Reset the state of our data so that each tests can run independently
  clear();
});

describe('clear', () => {
  test('has the correct return type, {}', () => {
    expect(clear()).toStrictEqual({});
  });
});

describe('addDiaryEntry', () => {
  test('has the correct return type', () => {
    const e = addDiaryEntry('Day 1', 'I worked on the adddDiaryEntry function');
    expect(e).toStrictEqual({ entryId: expect.any(Number) });
  });

  test('can add two entries with the same title and content', () => {
    const e1 = addDiaryEntry('Day 1', 'I worked on the adddDiaryEntry function');
    const e2 = addDiaryEntry('Day 1', 'I worked on the adddDiaryEntry function');
    expect(e2).toStrictEqual({ entryId: expect.any(Number)} )

    // The two diary entries should have two different IDs
    expect(e1.entryId).not.toStrictEqual(e2.entryId);
  });

  test.each([
    { title: '', content: 'valid' },
    { title: 'valid', content: '' },
    { title: '', content: '' },
  ])('returns an error for title=$title and content=$content', ({ title, content }) => {
    expect(addDiaryEntry(title, content)).toStrictEqual({ error: expect.any(String) });
  });
});

describe('viewDiary', () => {
  test('returns an error for a non-existent entry id', () => {
    expect(viewDiaryEntry(1)).toStrictEqual({ error: expect.any(String) });
  });

  describe('when one diary is created', () => {
    let entry;
    beforeEach(() => {
      entry = addDiaryEntry('Day 1', 'One day');
    });

    test('view diary with invalid id', () => {
      expect(viewDiaryEntry(entry.entryId + 1)).toStrictEqual({ error: expect.any(String) });
    });

    test('the correct details are returned', () => {
      expect(viewDiaryEntry(entry.entryId)).toStrictEqual({
        entry: {
          entryId: entry.entryId,
          title: 'Day 1',
          content: 'One day',
          timestamp: expect.any(Number),
        }
      });
    });
  });

  // Remove the todo and complete this test, or simply remove it and write other
  // test cases as you see fit.
  test.todo('can view multiple diary entries correctly');
});

describe('listDiaryEntries', () => {
  test('correctly list an empty diary', () => {
    expect(listDiaryEntries()).toStrictEqual({ entries: []})
  });

  test.todo('correctly list one entry');

  test.todo('correctly list multiple entries');
});

describe('editDiaryEntry', () => {
  test('returns an error for a non-existent entry id', () => {
    expect(editDiaryEntry(1, 'valid', 'valid')).toStrictEqual({ error: expect.any(String) });
  });

  describe('when one diary is created', () => {
    let entry;
    beforeEach(() => {
      entry = addDiaryEntry('Day 1', 'One day');
    });

    test.each([
      { title: '', content: 'valid' },
      { title: 'valid', content: '' },
      { title: '', content: '' },
    ])('returns an error for title=$title and content=$content', ({ title, content }) => {
      expect(editDiaryEntry(entry.entryId, title, content)).toStrictEqual({ error: expect.any(String) });
    });

    test.todo('and an invalid entry id is given');

    test.todo('has the correct return type');

    test('successfully edits a diary entry', () => {
      editDiaryEntry(entry.entryId, 'newtitle', 'newcontent')
      expect(viewDiaryEntry(entry.entryId)).toStrictEqual({
        entry: {
          entryId: entry.entryId,
          title: 'newtitle',
          content: 'newcontent',
          timestamp: expect.any(Number),
        }
      });
    });
  });

  test.todo('successfully edits multiple diary entries');
});

describe('searchDiary', () => {
  test('empty search string returns an error', () => {
    expect(searchDiary('', false)).toStrictEqual({ error: expect.any(String) });
  });

  test('returns no results for an empty diary', () => {
    expect(searchDiary('hi', false)).toStrictEqual({ entries: [] });
  });

  // TODO: add more tests
});

*/
