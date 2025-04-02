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

// Mock de la fonction slugify pour contrôler son comportement
jest.mock('../../lib/utils', () => ({
  slugify: (text) => text.toLowerCase().replace(/\s+/g, '-')
}));

describe('Posts Direct Branch Coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock de fs.readdirSync
    fs.readdirSync.mockReturnValue(['post-one.md', 'post-two.md']);
    
    // Mock de path.join
    path.join.mockImplementation((...args) => args.join('/'));
  });

  describe('getAllCategories - specific branch coverage', () => {
    it('handles posts with only category property (string)', () => {
      // Mock de fs.readFileSync pour un post avec category comme string
      fs.readFileSync.mockImplementation((path) => {
        if (path.includes('post-one')) {
          return '---\ntitle: Post One\ndate: 2023-01-01\ncategory: Category One\n---\nContent for post one';
        } else {
          return '---\ntitle: Post Two\ndate: 2023-01-02\n---\nContent for post two';
        }
      });
      
      const categories = getAllCategories();
      
      // Vérifier que la branche post.category est couverte (ligne 228)
      expect(categories).toContain('Category One');
      // Vérifier que la branche else est couverte (ligne 230)
      expect(categories).toContain('Uncategorized');
    });
  });

  describe('getAllCategorySlugs - specific branch coverage', () => {
    it('handles posts with only category property (string)', () => {
      // Mock de fs.readFileSync pour un post avec category comme string
      fs.readFileSync.mockImplementation((path) => {
        if (path.includes('post-one')) {
          return '---\ntitle: Post One\ndate: 2023-01-01\ncategory: Category One\n---\nContent for post one';
        } else {
          return '---\ntitle: Post Two\ndate: 2023-01-02\n---\nContent for post two';
        }
      });
      
      const slugs = getAllCategorySlugs();
      
      // Vérifier que la branche post.category est couverte (lignes 249-251)
      expect(slugs).toContain('category-one');
      // Vérifier que la branche pour Uncategorized est couverte
      expect(slugs).toContain('uncategorized');
    });
  });

  describe('getCategoryFromSlug - specific branch coverage', () => {
    it('handles posts with only category property (string)', () => {
      // Mock de fs.readFileSync pour un post avec category comme string
      fs.readFileSync.mockImplementation((path) => {
        if (path.includes('post-one')) {
          return '---\ntitle: Post One\ndate: 2023-01-01\ncategory: Category One\n---\nContent for post one';
        } else {
          return '---\ntitle: Post Two\ndate: 2023-01-02\n---\nContent for post two';
        }
      });
      
      // Vérifier que la branche post.category est couverte (lignes 269-270)
      const category = getCategoryFromSlug('category-one');
      expect(category).toBe('Category One');
      
      // Vérifier que la branche pour Uncategorized est couverte
      const uncategorized = getCategoryFromSlug('uncategorized');
      expect(uncategorized).toBe('Uncategorized');
    });
  });

  describe('getPostsByCategory - specific branch coverage', () => {
    it('handles posts with only category property (string)', () => {
      // Mock de fs.readFileSync pour un post avec category comme string
      fs.readFileSync.mockImplementation((path) => {
        if (path.includes('post-one')) {
          return '---\ntitle: Post One\ndate: 2023-01-01\ncategory: Category One\n---\nContent for post one';
        } else {
          return '---\ntitle: Post Two\ndate: 2023-01-02\n---\nContent for post two';
        }
      });
      
      // Vérifier que la branche post.category est couverte (lignes 289-290)
      const categoryPosts = getPostsByCategory('Category One');
      expect(categoryPosts.length).toBe(1);
      expect(categoryPosts[0].id).toBe('post-one');
      
      // Vérifier que la branche pour Uncategorized est couverte
      const uncategorizedPosts = getPostsByCategory('Uncategorized');
      expect(uncategorizedPosts.length).toBe(1);
      expect(uncategorizedPosts[0].id).toBe('post-two');
    });
  });
});
