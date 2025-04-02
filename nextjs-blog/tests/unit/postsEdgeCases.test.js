import {
  getSortedPostsData,
  getAllCategories,
  getAllCategorySlugs,
  getCategoryFromSlug,
  getPostsByCategory,
  getPostsByCategorySlug
} from '../../lib/posts';
import fs from 'fs';
import path from 'path';

// Mock des modules
jest.mock('fs');
jest.mock('path');

describe('Posts Functions Edge Cases', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock de fs.readdirSync
    fs.readdirSync.mockReturnValue(['post-one.md', 'post-two.md', 'post-three.md']);
    
    // Mock de fs.readFileSync
    fs.readFileSync.mockImplementation((path) => {
      if (path.includes('post-one')) {
        return '---\ntitle: Post One\ndate: 2023-01-02\ncategories: ["Category One", "Shared Category"]\n---\nContent for post one';
      } else if (path.includes('post-two')) {
        return '---\ntitle: Post Two\ndate: 2023-01-01\ncategory: Category Two\n---\nContent for post two';
      } else {
        return '---\ntitle: Post Three\ndate: 2023-01-03\n---\nContent for post three';
      }
    });
    
    // Mock de path.join
    path.join.mockImplementation((...args) => args.join('/'));
  });

  describe('getSortedPostsData', () => {
    it('sorts posts by date correctly', () => {
      const sortedPosts = getSortedPostsData();
      
      // Vérifie que les posts sont triés par date (du plus récent au plus ancien)
      expect(sortedPosts[0].id).toBe('post-three'); // Le plus récent
      expect(sortedPosts[1].id).toBe('post-one');
      expect(sortedPosts[2].id).toBe('post-two'); // Le plus ancien
    });
  });

  describe('getAllCategories', () => {
    it('handles posts with no categories', () => {
      // Remplacer temporairement readFileSync pour simuler un post sans catégorie
      fs.readFileSync.mockImplementationOnce(() => {
        return '---\ntitle: No Category Post\ndate: 2023-01-01\n---\nContent';
      });
      
      const categories = getAllCategories();
      
      expect(categories).toContain('Uncategorized');
    });
  });

  describe('getAllCategorySlugs', () => {
    it('handles posts with no categories', () => {
      // Remplacer temporairement readFileSync pour simuler un post sans catégorie
      fs.readFileSync.mockImplementationOnce(() => {
        return '---\ntitle: No Category Post\ndate: 2023-01-01\n---\nContent';
      });
      
      const slugs = getAllCategorySlugs();
      
      expect(slugs).toContain('uncategorized');
    });
  });

  describe('getCategoryFromSlug', () => {
    it('returns null for non-existent slugs', () => {
      const category = getCategoryFromSlug('non-existent-slug');
      
      expect(category).toBeNull();
    });
    
    it('handles posts with no categories', () => {
      // Remplacer temporairement readFileSync pour simuler un post sans catégorie
      fs.readFileSync.mockImplementationOnce(() => {
        return '---\ntitle: No Category Post\ndate: 2023-01-01\n---\nContent';
      });
      
      const category = getCategoryFromSlug('uncategorized');
      
      expect(category).toBe('Uncategorized');
    });
  });

  describe('getPostsByCategory', () => {
    it('returns all posts when category is "all"', () => {
      const allPosts = getPostsByCategory('all');
      
      expect(allPosts.length).toBe(3);
    });
    
    it('returns posts with matching category', () => {
      const categoryPosts = getPostsByCategory('Category Two');
      
      expect(categoryPosts.length).toBe(1);
      expect(categoryPosts[0].id).toBe('post-two');
    });
    
    it('returns posts with matching category from categories array', () => {
      const categoryPosts = getPostsByCategory('Shared Category');
      
      expect(categoryPosts.length).toBe(1);
      expect(categoryPosts[0].id).toBe('post-one');
    });
    
    it('returns uncategorized posts', () => {
      const uncategorizedPosts = getPostsByCategory('Uncategorized');
      
      expect(uncategorizedPosts.length).toBe(1);
      expect(uncategorizedPosts[0].id).toBe('post-three');
    });
  });

  describe('getPostsByCategorySlug', () => {
    it('returns empty array for non-existent category slug', () => {
      const posts = getPostsByCategorySlug('non-existent-slug');
      
      expect(posts).toEqual([]);
    });
    
    it('returns posts for a valid category slug', () => {
      const posts = getPostsByCategorySlug('category-two');
      
      expect(posts.length).toBe(1);
      expect(posts[0].id).toBe('post-two');
    });
  });
});
