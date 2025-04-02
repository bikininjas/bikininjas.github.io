import {
  getAllCategories,
  getAllCategorySlugs,
  getCategoryFromSlug,
  getPostsByCategory
} from '../../lib/posts';
import fs from 'fs';
import path from 'path';

// Mock des modules
jest.mock('fs');
jest.mock('path');

describe('Posts Functions Specific Branches Coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock de fs.readdirSync
    fs.readdirSync.mockReturnValue(['post-one.md', 'post-two.md']);
    
    // Mock de path.join
    path.join.mockImplementation((...args) => args.join('/'));
  });

  describe('getAllCategories - branch coverage', () => {
    it('handles posts with only string category property', () => {
      // Mock de fs.readFileSync pour des posts avec category comme string
      fs.readFileSync.mockImplementation((path) => {
        if (path.includes('post-one')) {
          return '---\ntitle: Post One\ndate: 2023-01-01\ncategory: Category One\n---\nContent for post one';
        } else {
          return '---\ntitle: Post Two\ndate: 2023-01-02\ncategory: Category Two\n---\nContent for post two';
        }
      });
      
      const categories = getAllCategories();
      
      expect(categories).toContain('Category One');
      expect(categories).toContain('Category Two');
      expect(categories.length).toBe(2);
    });
  });

  describe('getAllCategorySlugs - branch coverage', () => {
    it('handles posts with only string category property', () => {
      // Mock de fs.readFileSync pour des posts avec category comme string
      fs.readFileSync.mockImplementation((path) => {
        if (path.includes('post-one')) {
          return '---\ntitle: Post One\ndate: 2023-01-01\ncategory: Category One\n---\nContent for post one';
        } else {
          return '---\ntitle: Post Two\ndate: 2023-01-02\ncategory: Category Two\n---\nContent for post two';
        }
      });
      
      const slugs = getAllCategorySlugs();
      
      expect(slugs).toContain('category-one');
      expect(slugs).toContain('category-two');
      expect(slugs.length).toBe(2);
    });
  });

  describe('getCategoryFromSlug - branch coverage', () => {
    it('handles posts with only string category property', () => {
      // Mock de fs.readFileSync pour des posts avec category comme string
      fs.readFileSync.mockImplementation((path) => {
        if (path.includes('post-one')) {
          return '---\ntitle: Post One\ndate: 2023-01-01\ncategory: Category One\n---\nContent for post one';
        } else {
          return '---\ntitle: Post Two\ndate: 2023-01-02\ncategory: Category Two\n---\nContent for post two';
        }
      });
      
      const category = getCategoryFromSlug('category-one');
      
      expect(category).toBe('Category One');
    });
  });

  describe('getPostsByCategory - branch coverage', () => {
    it('handles posts with only string category property', () => {
      // Mock de fs.readFileSync pour des posts avec category comme string
      fs.readFileSync.mockImplementation((path) => {
        if (path.includes('post-one')) {
          return '---\ntitle: Post One\ndate: 2023-01-01\ncategory: Category One\n---\nContent for post one';
        } else {
          return '---\ntitle: Post Two\ndate: 2023-01-02\ncategory: Category Two\n---\nContent for post two';
        }
      });
      
      const posts = getPostsByCategory('Category One');
      
      expect(posts.length).toBe(1);
      expect(posts[0].id).toBe('post-one');
    });
    
    it('handles posts with categories array', () => {
      // Mock de fs.readFileSync pour des posts avec categories comme array
      fs.readFileSync.mockImplementation((path) => {
        if (path.includes('post-one')) {
          return '---\ntitle: Post One\ndate: 2023-01-01\ncategories: ["Category One", "Shared"]\n---\nContent for post one';
        } else {
          return '---\ntitle: Post Two\ndate: 2023-01-02\ncategories: ["Category Two", "Shared"]\n---\nContent for post two';
        }
      });
      
      const posts = getPostsByCategory('Shared');
      
      expect(posts.length).toBe(2);
      expect(posts.map(post => post.id).sort((a, b) => a.localeCompare(b)))
        .toEqual(['post-one', 'post-two'].sort((a, b) => a.localeCompare(b)));
    });
  });
});
