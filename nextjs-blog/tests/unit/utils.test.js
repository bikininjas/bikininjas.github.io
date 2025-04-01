import { slugify, formatDate } from '../../lib/utils';

describe('Utility Functions', () => {
  describe('slugify function', () => {
    it('converts a string to a URL-friendly slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('This is a test')).toBe('this-is-a-test');
      expect(slugify('Special Characters: !@#$%^&*()')).toBe('special-characters');
      expect(slugify('Multiple   Spaces')).toBe('multiple-spaces');
      expect(slugify('-Trim-Dashes-')).toBe('trim-dashes');
      expect(slugify('lowercase UPPERCASE')).toBe('lowercase-uppercase');
    });

    it('handles edge cases correctly', () => {
      expect(slugify('')).toBe('');
      expect(slugify('   ')).toBe('');
      expect(slugify('---')).toBe('');
      expect(slugify('!@#$%^&*()')).toBe('');
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
  });
});
