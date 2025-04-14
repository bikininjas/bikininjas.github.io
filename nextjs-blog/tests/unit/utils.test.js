import { slugify, formatDate } from '../../lib/utils';

describe('Utils Functions', () => {
  describe('slugify', () => {
    test('converts string to lowercase', () => {
      expect(slugify('HELLO')).toBe('hello');
    });

    test('replaces spaces with hyphens', () => {
      expect(slugify('hello world')).toBe('hello-world');
    });

    test('removes special characters', () => {
      expect(slugify('hello!@#$%^&*()')).toBe('hello');
    });

    test('handles accented characters', () => {
      expect(slugify('héllò wórld')).toBe('hello-world');
    });

    test('removes multiple spaces', () => {
      expect(slugify('hello    world')).toBe('hello-world');
    });

    test('handles empty string', () => {
      expect(slugify('')).toBe('');
    });

    test('handles string with only special characters', () => {
      expect(slugify('!@#$%^')).toBe('');
    });

    test('handles mixed case with special characters and spaces', () => {
      expect(slugify('Hello World! This is a Test')).toBe('hello-world-this-is-a-test');
    });

    test('handles numbers', () => {
      expect(slugify('Hello 123 World')).toBe('hello-123-world');
    });

    test('removes leading and trailing spaces', () => {
      expect(slugify('  hello world  ')).toBe('hello-world');
    });

    test('handles undefined input', () => {
      expect(slugify(undefined)).toBe('');
    });

    test('handles null input', () => {
      expect(slugify(null)).toBe('');
    });
  });

  describe('formatDate function', () => {
    it('formats dates correctly', () => {
      expect(formatDate('2023-01-01')).toBe('January 1, 2023');
      expect(formatDate('2023-12-31')).toBe('December 31, 2023');
      expect(formatDate('2024-02-29')).toBe('February 29, 2024');
    });

    it('handles different date formats', () => {
      // Test with ISO string
      expect(formatDate('2023-01-01T00:00:00.000Z')).toMatch(/January 1, 2023/);
      
      // Test with date object
      const dateObj = new Date('2023-05-15');
      expect(formatDate(dateObj)).toBe('May 15, 2023');
    });

    it('handles invalid dates', () => {
      expect(formatDate('')).toBe('Invalid Date');
      expect(formatDate('invalid')).toBe('Invalid Date');
      expect(formatDate(null)).toBe('Invalid Date');
      expect(formatDate(undefined)).toBe('Invalid Date');
    });
  });
});
