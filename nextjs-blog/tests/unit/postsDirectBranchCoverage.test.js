/**
 * @jest-environment jsdom
 */

import {
  getAllCategories,
  getAllCategorySlugs,
  getCategoryFromSlug,
  getPostsByCategory,
  getSortedPostsData,
  getPostData
} from '../../lib/posts';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Mock des modules
jest.mock('fs', () => ({
  readdirSync: jest.fn(),
  readFileSync: jest.fn(),
  existsSync: jest.fn()
}));

jest.mock('path', () => ({
  join: jest.fn(),
  resolve: jest.fn()
}));

jest.mock('gray-matter', () => jest.fn());

// Mock de la fonction slugify pour contrôler son comportement
jest.mock('../../lib/utils', () => ({
  slugify: (text) => text.toLowerCase().replace(/\s+/g, '-')
}));

describe('Posts Functions Direct Branch Coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    path.join.mockImplementation((...args) => args.join('/'));
  });

  describe('getSortedPostsData direct paths', () => {
    test('handles missing metadata fields', () => {
      fs.readdirSync.mockReturnValue(['test-post.md']);
      fs.readFileSync.mockReturnValue('---\ntitle: Test\n---\nContent');
      matter.mockReturnValue({
        data: { title: 'Test' },
        content: 'Content'
      });

      const posts = getSortedPostsData();
      expect(posts[0].category).toBe('Uncategorized');
      expect(posts[0].categories).toEqual(['Uncategorized']);
    });

    test('handles posts without frontmatter', () => {
      fs.readdirSync.mockReturnValue(['no-meta.md']);
      fs.readFileSync.mockReturnValue('Just content');
      matter.mockReturnValue({
        data: {},
        content: 'Just content'
      });

      const posts = getSortedPostsData();
      expect(posts[0].category).toBe('Uncategorized');
      expect(posts[0].categories).toEqual(['Uncategorized']);
    });
  });

  describe('getPostData direct paths', () => {
    test('handles markdown without embeds', async () => {
      fs.readFileSync.mockReturnValue('---\ntitle: Test\n---\nRegular content');
      matter.mockReturnValue({
        data: { title: 'Test' },
        content: 'Regular content'
      });

      const post = await getPostData('test-post');
      expect(post.contentHtml).toContain('<p>Regular content</p>');
    });

    test('handles markdown with mixed content', async () => {
      const content = `# Heading
![youtube](https://youtu.be/abc123 "Test Video")
Regular paragraph
![youtube](invalid-url)`;

      fs.readFileSync.mockReturnValue(`---\ntitle: Test\n---\n${content}`);
      matter.mockReturnValue({
        data: { title: 'Test' },
        content
      });

      const post = await getPostData('test-post');
      expect(post.contentHtml).toContain('<h1>Heading</h1>');
      expect(post.contentHtml).toContain('lite-youtube');
      expect(post.contentHtml).toContain('<p>Regular paragraph</p>');
      expect(post.contentHtml).toContain('![youtube](invalid-url)');
    });
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
