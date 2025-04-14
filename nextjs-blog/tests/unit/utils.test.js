/**
 * @jest-environment jsdom
 */

import { slugify, formatDate } from '../../lib/utils';

describe('Utils', () => {
  describe('slugify', () => {
    it('converts strings to lowercase', () => {
      expect(slugify('UPPERCASE')).toBe('uppercase');
    });

    it('replaces spaces with hyphens', () => {
      expect(slugify('This is a test')).toBe('this-is-a-test');
    });

    it('removes special characters', () => {
      expect(slugify('Special! @#$% Characters')).toBe('special-characters');
    });

    it('handles accented characters', () => {
      expect(slugify('àéïōũ')).toBe('aeiou');
    });

    it('removes trailing hyphens', () => {
      expect(slugify('trailing-')).toBe('trailing');
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
      expect(formatDate('2022-01-01')).toBe('January 1, 2022');
    });

    it('handles different date formats', () => {
      expect(formatDate('01/02/2022')).toBe('January 2, 2022');
    });

    it('handles invalid dates', () => {
      expect(formatDate('invalid-date')).toBe('Invalid Date');
    });
  });
});
