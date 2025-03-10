import { holidaysInRange } from './holidays';

test('Example - replace me', () => {
  expect(holidaysInRange(1970, 1972)).toStrictEqual([
    {
      halloween: 'Saturday, 31.10.1970',
      christmas: 'Friday, 25.12.1970',
      mothersDay: 'Sunday, 10.05.1970'
    },
    {
      halloween: 'Sunday, 31.10.1971',
      christmas: 'Saturday, 25.12.1971',
      mothersDay: 'Sunday, 09.05.1971'
    },
    {
      halloween: 'Tuesday, 31.10.1972',
      christmas: 'Monday, 25.12.1972',
      mothersDay: 'Sunday, 14.05.1972'
    }
  ]);
});
