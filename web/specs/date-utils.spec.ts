import { formatDate, relativeTime } from '../src/lib/date-utils';

describe('date-utils', () => {
  it('formatDate should format a date string', () => {
    const result = formatDate('2020-01-01');
    expect(result).toMatch(/2020/);
  });

  it('relativeTime should return a string', () => {
    const result = relativeTime(new Date());
    expect(typeof result).toBe('string');
  });
});
