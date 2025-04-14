/**
 * @jest-environment jsdom
 */

import { slugify, formatDate } from '../../lib/utils';

describe('Utils', () => {
  describe('slugify', () => {
    it('converts strings to lowercase', () => {
      expect(slugify('Test String')).toBe('test-string');
    });

    it('replaces spaces with hyphens', () => {
      expect(slugify('multiple   spaces')).toBe('multiple-spaces');
    });

    it('removes special characters', () => {
      expect(slugify('Special! @#$% Characters')).toBe('special-characters');
    });

    it('handles accented characters', () => {
      expect(slugify('àéïōũ')).toBe('aeiou');
    });

    it('removes trailing hyphens', () => {
      expect(slugify('test!')).toBe('test');
    });

    it('handles empty strings', () => {
      expect(slugify('')).toBe('');
    });

    it('handles null or undefined', () => {
      expect(slugify(null)).toBe('');
      expect(slugify(undefined)).toBe('');
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
