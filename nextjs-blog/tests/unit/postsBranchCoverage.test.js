/**
 * @jest-environment jsdom
 */

import {
  getAllCategories,
  getAllCategorySlugs,
  getCategoryFromSlug,
  getPostsByCategory
} from '../../lib/posts';
import fs from 'fs';
import path from 'path';

// Mock modules before imports
jest.mock('fs', () => ({
  readdirSync: jest.fn(),
  readFileSync: jest.fn(),
  existsSync: jest.fn()
}));

jest.mock('path', () => ({
  join: jest.fn(),
  resolve: jest.fn()
}));

describe('Posts Functions Branch Coverage', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock de fs.readdirSync
    fs.readdirSync.mockReturnValue(['post-one.md', 'post-two.md']);
    
    // Mock de path.join
    path.join.mockImplementation((...args) => args.join('/'));
  });

  describe('getAllCategories with only uncategorized posts', () => {
    beforeEach(() => {
      // Mock de fs.readFileSync pour des posts sans catégories
      fs.readFileSync.mockImplementation((path) => {
        if (path.includes('post-one')) {
          return '---\ntitle: Post One\ndate: 2023-01-01\n---\nContent for post one';
        } else {
          return '---\ntitle: Post Two\ndate: 2023-01-02\n---\nContent for post two';
        }
      });
    });

    it('returns only Uncategorized when no posts have categories', () => {
      const categories = getAllCategories();
      
      expect(categories).toEqual(['Uncategorized']);
      expect(categories.length).toBe(1);
    });
  });

  describe('getAllCategories with only category property', () => {
    beforeEach(() => {
      // Mock de fs.readFileSync pour des posts avec category (pas categories)
      fs.readFileSync.mockImplementation((path) => {
        if (path.includes('post-one')) {
          return '---\ntitle: Post One\ndate: 2023-01-01\ncategory: Category One\n---\nContent for post one';
        } else {
          return '---\ntitle: Post Two\ndate: 2023-01-02\ncategory: Category Two\n---\nContent for post two';
        }
      });
    });

    it('handles posts with only category property', () => {
      const categories = getAllCategories();
      
      expect(categories).toContain('Category One');
      expect(categories).toContain('Category Two');
      expect(categories.length).toBe(2);
    });
  });

  describe('getAllCategorySlugs with only uncategorized posts', () => {
    beforeEach(() => {
      // Mock de fs.readFileSync pour des posts sans catégories
      fs.readFileSync.mockImplementation((path) => {
        if (path.includes('post-one')) {
          return '---\ntitle: Post One\ndate: 2023-01-01\n---\nContent for post one';
        } else {
          return '---\ntitle: Post Two\ndate: 2023-01-02\n---\nContent for post two';
        }
      });
    });

    it('returns only uncategorized slug when no posts have categories', () => {
      const slugs = getAllCategorySlugs();
      
      expect(slugs).toEqual(['uncategorized']);
      expect(slugs.length).toBe(1);
    });
  });

  describe('getAllCategorySlugs with only category property', () => {
    beforeEach(() => {
      // Mock de fs.readFileSync pour des posts avec category (pas categories)
      fs.readFileSync.mockImplementation((path) => {
        if (path.includes('post-one')) {
          return '---\ntitle: Post One\ndate: 2023-01-01\ncategory: Category One\n---\nContent for post one';
        } else {
          return '---\ntitle: Post Two\ndate: 2023-01-02\ncategory: Category Two\n---\nContent for post two';
        }
      });
    });

    it('handles posts with only category property', () => {
      const slugs = getAllCategorySlugs();
      
      expect(slugs).toContain('category-one');
      expect(slugs).toContain('category-two');
      expect(slugs.length).toBe(2);
    });
  });

  describe('getCategoryFromSlug with only uncategorized posts', () => {
    beforeEach(() => {
      // Mock de fs.readFileSync pour des posts sans catégories
      fs.readFileSync.mockImplementation((path) => {
        if (path.includes('post-one')) {
          return '---\ntitle: Post One\ndate: 2023-01-01\n---\nContent for post one';
        } else {
          return '---\ntitle: Post Two\ndate: 2023-01-02\n---\nContent for post two';
        }
      });
    });

    it('returns Uncategorized for uncategorized slug', () => {
      const category = getCategoryFromSlug('uncategorized');
      
      expect(category).toBe('Uncategorized');
    });
  });

  describe('getCategoryFromSlug with only category property', () => {
    beforeEach(() => {
      // Mock de fs.readFileSync pour des posts avec category (pas categories)
      fs.readFileSync.mockImplementation((path) => {
        if (path.includes('post-one')) {
          return '---\ntitle: Post One\ndate: 2023-01-01\ncategory: Category One\n---\nContent for post one';
        } else {
          return '---\ntitle: Post Two\ndate: 2023-01-02\ncategory: Category Two\n---\nContent for post two';
        }
      });
    });

    it('handles posts with only category property', () => {
      const category = getCategoryFromSlug('category-one');
      
      expect(category).toBe('Category One');
    });
  });

  describe('getPostsByCategory with only uncategorized posts', () => {
    beforeEach(() => {
      // Mock de fs.readFileSync pour des posts sans catégories
      fs.readFileSync.mockImplementation((path) => {
        if (path.includes('post-one')) {
          return '---\ntitle: Post One\ndate: 2023-01-01\n---\nContent for post one';
        } else {
          return '---\ntitle: Post Two\ndate: 2023-01-02\n---\nContent for post two';
        }
      });
    });

    it('returns all posts for Uncategorized category', () => {
      const posts = getPostsByCategory('Uncategorized');
      
      expect(posts.length).toBe(2);
      // Les posts sont triés par date, donc post-two (date: 2023-01-02) vient avant post-one (date: 2023-01-01)
      expect(posts.map(post => post.id).sort((a, b) => a.localeCompare(b))).toEqual(['post-one', 'post-two'].sort((a, b) => a.localeCompare(b)));
    });
  });

  describe('getPostsByCategory with only category property', () => {
    beforeEach(() => {
      // Mock de fs.readFileSync pour des posts avec category (pas categories)
      fs.readFileSync.mockImplementation((path) => {
        if (path.includes('post-one')) {
          return '---\ntitle: Post One\ndate: 2023-01-01\ncategory: Category One\n---\nContent for post one';
        } else {
          return '---\ntitle: Post Two\ndate: 2023-01-02\ncategory: Category Two\n---\nContent for post two';
        }
      });
    });

    it('returns posts with matching category property', () => {
      const posts = getPostsByCategory('Category One');
      
      expect(posts.length).toBe(1);
      expect(posts[0].id).toBe('post-one');
    });
  });
});
