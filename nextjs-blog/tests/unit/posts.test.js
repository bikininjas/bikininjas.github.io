import {
  getSortedPostsData,
  getPostData,
  getAllPostIds,
  getAllCategories,
  getPostsByCategorySlug,
  getCategoryFromSlug,
  getPostBySlug,
  convertMarkdownToHtml,
  extractMetadata,
  validateMetadata
} from '../../lib/posts';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

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

describe('Posts Utility Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSortedPostsData', () => {
    test('returns posts sorted by date in descending order', () => {
      const mockFiles = ['post1.md', 'post2.md', 'post3.md'];
      const mockFileContents = {
        'post1.md': '---\ntitle: Post 1\ndate: 2023-03-01\n---\ncontent1',
        'post2.md': '---\ntitle: Post 2\ndate: 2023-03-03\n---\ncontent2',
        'post3.md': '---\ntitle: Post 3\ndate: 2023-03-02\n---\ncontent3'
      };

      fs.readdirSync.mockReturnValue(mockFiles);
      fs.readFileSync.mockImplementation((file) => mockFileContents[path.basename(file)]);
      matter.mockImplementation((content) => ({
        data: {
          title: content.includes('Post 1') ? 'Post 1' : content.includes('Post 2') ? 'Post 2' : 'Post 3',
          date: content.includes('2023-03-01') ? '2023-03-01' : content.includes('2023-03-03') ? '2023-03-03' : '2023-03-02'
        }
      }));

      const result = getSortedPostsData();
      expect(result).toHaveLength(3);
      expect(result[0].date).toBe('2023-03-03');
      expect(result[1].date).toBe('2023-03-02');
      expect(result[2].date).toBe('2023-03-01');
    });

    test('handles missing date field', () => {
      const mockFiles = ['post1.md', 'post2.md'];
      const mockFileContents = {
        'post1.md': '---\ntitle: Post 1\n---\ncontent1',
        'post2.md': '---\ntitle: Post 2\ndate: 2023-03-01\n---\ncontent2'
      };

      fs.readdirSync.mockReturnValue(mockFiles);
      fs.readFileSync.mockImplementation((file) => mockFileContents[path.basename(file)]);
      matter.mockImplementation((content) => ({
        data: content.includes('Post 1') ? { title: 'Post 1' } : { title: 'Post 2', date: '2023-03-01' }
      }));

      const result = getSortedPostsData();
      expect(result).toHaveLength(2);
      expect(result[0].date).toBe('2023-03-01');
      expect(result[1].date).toBeUndefined();
    });
  });

  describe('getPostData', () => {
    test('returns post data with HTML content', async () => {
      const mockFileContent = '---\ntitle: Test Post\ndate: 2023-01-01\n---\n# Test Content';
      fs.readFileSync.mockReturnValue(mockFileContent);
      matter.mockReturnValue({
        data: { title: 'Test Post', date: '2023-01-01' },
        content: '# Test Content'
      });

      const result = await getPostData('test-post');
      expect(result.title).toBe('Test Post');
      expect(result.date).toBe('2023-01-01');
      expect(result.contentHtml).toBeDefined();
    });
  });

  describe('getAllPostIds', () => {
    test('returns array of post IDs', () => {
      const mockFiles = ['post1.md', 'post2.md'];
      fs.readdirSync.mockReturnValue(mockFiles);

      const result = getAllPostIds();
      expect(result).toEqual([
        { params: { id: 'post1' } },
        { params: { id: 'post2' } }
      ]);
    });
  });

  describe('getAllCategories', () => {
    test('returns unique sorted categories', () => {
      const mockFiles = ['post1.md', 'post2.md'];
      const mockFileContents = {
        'post1.md': '---\ntitle: Post 1\ncategory: Tech\n---\ncontent1',
        'post2.md': '---\ntitle: Post 2\ncategory: Tech\n---\ncontent2'
      };

      fs.readdirSync.mockReturnValue(mockFiles);
      fs.readFileSync.mockImplementation((file) => mockFileContents[path.basename(file)]);
      matter.mockImplementation((content) => ({
        data: { category: 'Tech' }
      }));

      const result = getAllCategories();
      expect(result).toEqual(['Tech']);
    });
  });

  describe('getPostsByCategorySlug', () => {
    test('returns posts filtered by category slug', () => {
      const mockFiles = ['post1.md', 'post2.md'];
      const mockFileContents = {
        'post1.md': '---\ntitle: Post 1\ncategory: Tech\n---\ncontent1',
        'post2.md': '---\ntitle: Post 2\ncategory: Gaming\n---\ncontent2'
      };

      fs.readdirSync.mockReturnValue(mockFiles);
      fs.readFileSync.mockImplementation((file) => mockFileContents[path.basename(file)]);
      matter.mockImplementation((content) => ({
        data: {
          title: content.includes('Post 1') ? 'Post 1' : 'Post 2',
          category: content.includes('Post 1') ? 'Tech' : 'Gaming'
        }
      }));

      const result = getPostsByCategorySlug('tech');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Post 1');
    });
  });

  describe('getCategoryFromSlug', () => {
    test('returns category name from slug', () => {
      const mockFiles = ['post1.md'];
      const mockFileContent = '---\ntitle: Post 1\ncategory: Tech\n---\ncontent1';

      fs.readdirSync.mockReturnValue(mockFiles);
      fs.readFileSync.mockReturnValue(mockFileContent);
      matter.mockReturnValue({
        data: { category: 'Tech' }
      });

      const result = getCategoryFromSlug('tech');
      expect(result).toBe('Tech');
    });

    test('returns null for invalid slug', () => {
      fs.readdirSync.mockReturnValue([]);
      const result = getCategoryFromSlug('invalid-slug');
      expect(result).toBeNull();
    });
  });

  describe('getPostBySlug', () => {
    test('returns post data for valid slug', () => {
      const slug = 'test-post';
      const mockContent = '---\ntitle: Test Post\ndate: 2023-03-01\n---\nTest content';

      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(mockContent);
      matter.mockReturnValue({
        data: { title: 'Test Post', date: '2023-03-01' },
        content: 'Test content'
      });

      const result = getPostBySlug(slug);
      expect(result).toEqual({
        slug,
        title: 'Test Post',
        date: '2023-03-01',
        content: 'Test content'
      });
    });

    test('returns null for invalid slug', () => {
      fs.existsSync.mockReturnValue(false);
      const result = getPostBySlug('invalid-slug');
      expect(result).toBeNull();
    });
  });

  describe('convertMarkdownToHtml', () => {
    test('converts markdown to HTML', async () => {
      const markdown = '# Test\nThis is a test';
      const result = await convertMarkdownToHtml(markdown);
      expect(result).toContain('<h1>Test</h1>');
      expect(result).toContain('<p>This is a test</p>');
    });

    test('handles empty markdown', async () => {
      const result = await convertMarkdownToHtml('');
      expect(result).toBe('');
    });

    test('preserves code blocks', async () => {
      const markdown = '```javascript\nconst x = 1;\n```';
      const result = await convertMarkdownToHtml(markdown);
      expect(result).toContain('<pre><code class="language-javascript">');
      expect(result).toContain('const x = 1;');
    });
  });

  describe('getPostsByCategorySlug with metadata', () => {
    test('returns posts with complete metadata', () => {
      const mockFiles = ['post1.md', 'post2.md'];
      const mockFileContents = {
        'post1.md': '---\ntitle: Post 1\ndate: 2023-03-01\ncategory: Tech\nexcerpt: Tech post\n---\ncontent1',
        'post2.md': '---\ntitle: Post 2\ndate: 2023-03-02\ncategory: Tech\nexcerpt: Another tech post\n---\ncontent2'
      };

      fs.readdirSync.mockReturnValue(mockFiles);
      fs.readFileSync.mockImplementation((file) => mockFileContents[path.basename(file)]);
      matter.mockImplementation((content) => ({
        data: {
          title: content.includes('Post 1') ? 'Post 1' : 'Post 2',
          date: content.includes('2023-03-01') ? '2023-03-01' : '2023-03-02',
          category: 'Tech',
          excerpt: content.includes('Tech post') ? 'Tech post' : 'Another tech post'
        }
      }));

      const result = getPostsByCategorySlug('tech');
      expect(result).toHaveLength(2);
      expect(result[0].excerpt).toBe('Another tech post');
      expect(result[1].excerpt).toBe('Tech post');
    });
  });

  describe('error handling', () => {
    test('handles file system errors gracefully', () => {
      fs.readdirSync.mockImplementation(() => {
        throw new Error('File system error');
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const result = getSortedPostsData();
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    test('handles malformed frontmatter', () => {
      const mockFiles = ['post1.md'];
      const mockContent = 'Invalid frontmatter\n---\nContent';

      fs.readdirSync.mockReturnValue(mockFiles);
      fs.readFileSync.mockReturnValue(mockContent);
      matter.mockImplementation(() => {
        throw new Error('Invalid frontmatter');
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const result = getSortedPostsData();
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});

describe('Post Metadata Functions', () => {
  describe('extractMetadata', () => {
    test('extracts basic metadata from frontmatter', () => {
      const content = `---
title: Test Post
date: 2023-01-01
category: Tech
excerpt: Test excerpt
---
Content here`;

      const metadata = extractMetadata(content);
      expect(metadata).toEqual({
        title: 'Test Post',
        date: '2023-01-01',
        category: 'Tech',
        excerpt: 'Test excerpt'
      });
    });

    test('handles missing optional fields', () => {
      const content = `---
title: Test Post
date: 2023-01-01
---
Content here`;

      const metadata = extractMetadata(content);
      expect(metadata).toEqual({
        title: 'Test Post',
        date: '2023-01-01'
      });
    });

    test('handles malformed frontmatter', () => {
      const content = `Invalid frontmatter
title: Test Post
---
Content here`;

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const metadata = extractMetadata(content);
      expect(metadata).toEqual({});
      consoleSpy.mockRestore();
    });
  });

  describe('validateMetadata', () => {
    test('validates required fields', () => {
      const validMetadata = {
        title: 'Test Post',
        date: '2023-01-01',
        category: 'Tech'
      };

      expect(validateMetadata(validMetadata)).toBe(true);
    });

    test('fails on missing title', () => {
      const invalidMetadata = {
        date: '2023-01-01',
        category: 'Tech'
      };

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      expect(validateMetadata(invalidMetadata)).toBe(false);
      consoleSpy.mockRestore();
    });

    test('fails on invalid date format', () => {
      const invalidMetadata = {
        title: 'Test Post',
        date: 'invalid-date',
        category: 'Tech'
      };

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      expect(validateMetadata(invalidMetadata)).toBe(false);
      consoleSpy.mockRestore();
    });
  });
});
