import {
  getAllCategories,
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

describe('Posts Remaining Coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock de fs.readdirSync
    fs.readdirSync.mockReturnValue(['post-one.md', 'post-two.md', 'post-three.md']);
    
    // Mock de path.join
    path.join.mockImplementation((...args) => args.join('/'));
  });

  describe('getAllCategories - edge cases', () => {
    it('handles empty categories array', () => {
      // Mock de fs.readFileSync pour un post avec un tableau de catégories vide
      fs.readFileSync.mockImplementation((path) => {
        if (path.includes('post-one')) {
          return '---\ntitle: Post One\ndate: 2023-01-01\ncategories: []\n---\nContent for post one';
        } else if (path.includes('post-two')) {
          return '---\ntitle: Post Two\ndate: 2023-01-02\n---\nContent for post two';
        } else {
          return '---\ntitle: Post Three\ndate: 2023-01-03\ncategory: Category Three\n---\nContent for post three';
        }
      });
      
      const categories = getAllCategories();
      
      // Vérifier que les catégories sont correctement traitées
      expect(categories).toContain('Uncategorized');
      expect(categories).toContain('Category Three');
      expect(categories.length).toBe(2);
    });
  });

  describe('getPostsByCategory - edge cases', () => {
    it('handles empty categories array', () => {
      // Mock de fs.readFileSync pour un post avec un tableau de catégories vide
      fs.readFileSync.mockImplementation((path) => {
        if (path.includes('post-one')) {
          return '---\ntitle: Post One\ndate: 2023-01-01\ncategories: []\n---\nContent for post one';
        } else if (path.includes('post-two')) {
          return '---\ntitle: Post Two\ndate: 2023-01-02\n---\nContent for post two';
        } else {
          return '---\ntitle: Post Three\ndate: 2023-01-03\ncategory: Category Three\n---\nContent for post three';
        }
      });
      
      // Tester avec une catégorie qui n'existe pas dans les posts
      const uncategorizedPosts = getPostsByCategory('Uncategorized');
      expect(uncategorizedPosts.length).toBe(2);
      
      // Vérifier que les posts sont présents sans se soucier de l'ordre
      // car ils sont triés par date et l'ordre peut varier
      const postIds = uncategorizedPosts.map(post => post.id);
      expect(postIds).toContain('post-one');
      expect(postIds).toContain('post-two');
      
      // Tester avec une catégorie qui existe
      const categoryThreePosts = getPostsByCategory('Category Three');
      expect(categoryThreePosts.length).toBe(1);
      expect(categoryThreePosts[0].id).toBe('post-three');
    });
  });
});
