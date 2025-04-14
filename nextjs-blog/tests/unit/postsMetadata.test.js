import {
  getSortedPostsData,
  getPostData,
  getAllPostIds,
  getAllCategories,
  getPostsByCategorySlug,
  validatePostMetadata,
  extractPostMetadata
} from '../../lib/posts';
import fs from 'fs';
import matter from 'gray-matter';

jest.mock('fs', () => ({
  readdirSync: jest.fn(),
  readFileSync: jest.fn(),
  existsSync: jest.fn()
}));

jest.mock('gray-matter', () => jest.fn());

describe('Posts Metadata Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validatePostMetadata', () => {
    test('validates complete metadata', () => {
      const validMetadata = {
        title: 'Test Post',
        date: '2023-01-01',
        excerpt: 'Test excerpt',
        category: 'Test Category',
        author: 'Test Author'
      };

      expect(validatePostMetadata(validMetadata)).toBe(true);
    });

    test('fails on missing required fields', () => {
      const invalidMetadata = {
        date: '2023-01-01',
        excerpt: 'Test excerpt'
      };

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      expect(validatePostMetadata(invalidMetadata)).toBe(false);
      consoleSpy.mockRestore();
    });

    test('fails on invalid date format', () => {
      const invalidMetadata = {
        title: 'Test Post',
        date: 'invalid-date',
        excerpt: 'Test excerpt'
      };

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      expect(validatePostMetadata(invalidMetadata)).toBe(false);
      consoleSpy.mockRestore();
    });
  });

  describe('extractPostMetadata', () => {
    test('extracts metadata from valid frontmatter', () => {
      const content = `---
title: Test Post
date: 2023-01-01
category: Test Category
excerpt: Test excerpt
---
Content here`;

      matter.mockReturnValue({
        data: {
          title: 'Test Post',
          date: '2023-01-01',
          category: 'Test Category',
          excerpt: 'Test excerpt'
        }
      });

      const metadata = extractPostMetadata(content);
      expect(metadata).toEqual({
        title: 'Test Post',
        date: '2023-01-01',
        category: 'Test Category',
        excerpt: 'Test excerpt'
      });
    });

    test('handles missing frontmatter', () => {
      const content = 'Just content, no frontmatter';
      matter.mockImplementation(() => {
        throw new Error('No frontmatter found');
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const metadata = extractPostMetadata(content);
      expect(metadata).toEqual({});
      consoleSpy.mockRestore();
    });

    test('handles malformed frontmatter', () => {
      const content = `---
title: "Unclosed quote
---`;
      matter.mockImplementation(() => {
        throw new Error('Invalid frontmatter');
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const metadata = extractPostMetadata(content);
      expect(metadata).toEqual({});
      consoleSpy.mockRestore();
    });
  });

  describe('error handling in file operations', () => {
    test('handles non-existent posts directory', () => {
      fs.readdirSync.mockImplementation(() => {
        throw new Error('ENOENT: no such file or directory');
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const posts = getSortedPostsData();
      expect(posts).toEqual([]);
      consoleSpy.mockRestore();
    });

    test('handles file read errors', () => {
      fs.readdirSync.mockReturnValue(['post.md']);
      fs.readFileSync.mockImplementation(() => {
        throw new Error('EACCES: permission denied');
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const posts = getSortedPostsData();
      expect(posts).toEqual([]);
      consoleSpy.mockRestore();
    });

    test('handles invalid file content', () => {
      fs.readdirSync.mockReturnValue(['post.md']);
      fs.readFileSync.mockReturnValue('Invalid content');
      matter.mockImplementation(() => {
        throw new Error('Invalid content');
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const posts = getSortedPostsData();
      expect(posts).toEqual([]);
      consoleSpy.mockRestore();
    });
  });
});