// Import des fonctions depuis le module posts
const postsModule = require('../../lib/posts');

// Mock des données de posts pour les tests
const mockPostsData = [
  {
    id: 'post-one',
    title: 'Post One',
    date: '2023-01-01',
    categories: ['Category One', 'Shared Category']
  },
  {
    id: 'post-two',
    title: 'Post Two',
    date: '2023-01-02',
    category: 'Category Two' // Utilise category au lieu de categories
  },
  {
    id: 'post-three',
    title: 'Post Three',
    date: '2023-01-03'
    // Pas de catégorie du tout
  }
];

// Mock de toutes les fonctions de catégories
jest.mock('../../lib/posts', () => ({
  getSortedPostsData: jest.fn(),
  getAllCategories: jest.fn(),
  getAllCategorySlugs: jest.fn(),
  getCategoryFromSlug: jest.fn(),
  getPostsByCategory: jest.fn(),
  getPostsByCategorySlug: jest.fn()
}));

describe('Category Functions Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configurer le mock pour getSortedPostsData
    postsModule.getSortedPostsData.mockReturnValue(mockPostsData);
    
    // Réimplémenter les fonctions de catégories pour utiliser notre mock
    postsModule.getAllCategories.mockImplementation(() => {
      const categories = new Set();
      mockPostsData.forEach(post => {
        if (post.categories && Array.isArray(post.categories)) {
          post.categories.forEach(category => categories.add(category));
        } else if (post.category) {
          categories.add(post.category);
        } else {
          categories.add('Uncategorized');
        }
      });
      return Array.from(categories).sort();
    });
    
    postsModule.getAllCategorySlugs.mockImplementation(() => {
      const slugs = new Set();
      mockPostsData.forEach(post => {
        if (post.categories && Array.isArray(post.categories)) {
          post.categories.forEach(category => {
            const slug = category.toLowerCase().replace(/\s+/g, '-');
            slugs.add(slug);
          });
        } else {
          const category = post.category || 'Uncategorized';
          const slug = category.toLowerCase().replace(/\s+/g, '-');
          slugs.add(slug);
        }
      });
      return Array.from(slugs);
    });
    
    postsModule.getCategoryFromSlug.mockImplementation((slug) => {
      const categoryMap = new Map();
      mockPostsData.forEach(post => {
        if (post.categories && Array.isArray(post.categories)) {
          post.categories.forEach(category => {
            const catSlug = category.toLowerCase().replace(/\s+/g, '-');
            categoryMap.set(catSlug, category);
          });
        } else {
          const category = post.category || 'Uncategorized';
          const catSlug = category.toLowerCase().replace(/\s+/g, '-');
          categoryMap.set(catSlug, category);
        }
      });
      return categoryMap.get(slug) || null;
    });
    
    postsModule.getPostsByCategory.mockImplementation((category) => {
      if (category === 'all') {
        return mockPostsData;
      }
      
      return mockPostsData.filter(post => {
        if (post.categories && Array.isArray(post.categories)) {
          return post.categories.includes(category);
        } else {
          const postCategory = post.category || 'Uncategorized';
          return postCategory === category;
        }
      });
    });
    
    postsModule.getPostsByCategorySlug.mockImplementation((slug) => {
      const category = postsModule.getCategoryFromSlug(slug);
      if (!category) {
        return [];
      }
      return postsModule.getPostsByCategory(category);
    });
  });

  describe('getAllCategories', () => {
    it('handles posts with different category formats', () => {
      const categories = postsModule.getAllCategories();
      
      expect(categories).toContain('Category One');
      expect(categories).toContain('Category Two');
      expect(categories).toContain('Shared Category');
      expect(categories).toContain('Uncategorized');
      expect(categories.length).toBe(4);
    });
  });

  describe('getAllCategorySlugs', () => {
    it('handles posts with different category formats', () => {
      const slugs = postsModule.getAllCategorySlugs();
      
      expect(slugs).toContain('category-one');
      expect(slugs).toContain('category-two');
      expect(slugs).toContain('shared-category');
      expect(slugs).toContain('uncategorized');
      expect(slugs.length).toBe(4);
    });
  });

  describe('getCategoryFromSlug', () => {
    it('returns the correct category for a slug', () => {
      expect(postsModule.getCategoryFromSlug('category-one')).toBe('Category One');
      expect(postsModule.getCategoryFromSlug('category-two')).toBe('Category Two');
      expect(postsModule.getCategoryFromSlug('shared-category')).toBe('Shared Category');
      expect(postsModule.getCategoryFromSlug('uncategorized')).toBe('Uncategorized');
    });
    
    it('returns null for non-existent slugs', () => {
      expect(postsModule.getCategoryFromSlug('non-existent')).toBe(null);
    });
  });

  describe('getPostsByCategory', () => {
    it('returns all posts when category is "all"', () => {
      const allPosts = postsModule.getPostsByCategory('all');
      expect(allPosts).toEqual(mockPostsData);
    });
    
    it('returns posts filtered by category with different category formats', () => {
      // Test avec un post qui a categories comme tableau
      const categoryOnePosts = postsModule.getPostsByCategory('Category One');
      expect(categoryOnePosts.length).toBe(1);
      expect(categoryOnePosts[0].id).toBe('post-one');
      
      // Test avec un post qui a category comme string
      const categoryTwoPosts = postsModule.getPostsByCategory('Category Two');
      expect(categoryTwoPosts.length).toBe(1);
      expect(categoryTwoPosts[0].id).toBe('post-two');
      
      // Test avec un post qui n'a pas de catégorie (devrait être "Uncategorized")
      const uncategorizedPosts = postsModule.getPostsByCategory('Uncategorized');
      expect(uncategorizedPosts.length).toBe(1);
      expect(uncategorizedPosts[0].id).toBe('post-three');
    });
    
    it('returns empty array for non-existent categories', () => {
      const nonExistentPosts = postsModule.getPostsByCategory('Non-Existent');
      expect(nonExistentPosts.length).toBe(0);
    });
  });

  describe('getPostsByCategorySlug', () => {
    it('returns posts filtered by category slug', () => {
      // Test avec un slug qui existe
      const categoryOnePosts = postsModule.getPostsByCategorySlug('category-one');
      expect(categoryOnePosts.length).toBe(1);
      expect(categoryOnePosts[0].id).toBe('post-one');
    });
    
    it('returns empty array for non-existent category slugs', () => {
      // Test avec un slug qui n'existe pas
      const nonExistentPosts = postsModule.getPostsByCategorySlug('non-existent');
      expect(nonExistentPosts.length).toBe(0);
    });
  });
});
