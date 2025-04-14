import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { 
  getSortedPostsData, 
  getPostData, 
  getAllPostIds,
  getCategoriesWithCount,
  getPostsByCategory 
} from '../posts';

// Mock the filesystem modules
jest.mock('fs');
jest.mock('path');
jest.mock('gray-matter');

describe('Posts library', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Setup mock filesystem data
    fs.readdirSync.mockReturnValue(['post1.md', 'post2.md']);
    
    path.join.mockImplementation((...args) => args.join('/'));
    
    // Mock file content
    const mockFileContents = {
      'posts/post1.md': '---\ntitle: Test Post 1\ndate: 2023-01-01\ncategory: Tech\n---\nContent for post 1',
      'posts/post2.md': '---\ntitle: Test Post 2\ndate: 2023-01-02\ncategory: Travel\n---\nContent for post 2',
    };
    
    fs.readFileSync.mockImplementation((filePath) => {
      return mockFileContents[filePath] || '';
    });
    
    // Mock matter to return structured data
    matter.mockImplementation((content) => {
      if (content.includes('Test Post 1')) {
        return {
          data: { title: 'Test Post 1', date: '2023-01-01', category: 'Tech' },
          content: 'Content for post 1'
        };
      } else {
        return {
          data: { title: 'Test Post 2', date: '2023-01-02', category: 'Travel' },
          content: 'Content for post 2'
        };
      }
    });
  });

  test('getSortedPostsData returns posts sorted by date', () => {
    const result = getSortedPostsData();
    
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('Test Post 2'); // Should be first as it's newer
    expect(result[1].title).toBe('Test Post 1');
  });

  test('getPostData returns data for a specific post', async () => {
    const result = await getPostData('post1');
    
    expect(result.title).toBe('Test Post 1');
    expect(result.id).toBe('post1');
    expect(result).toHaveProperty('contentHtml');
  });

  test('getAllPostIds returns formatted ids for all posts', () => {
    const result = getAllPostIds();
    
    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty('params');
    expect(result[0].params).toHaveProperty('id', 'post1');
  });

  test('getCategoriesWithCount returns categories with post count', () => {
    const result = getCategoriesWithCount();
    
    expect(result).toHaveProperty('Tech', 1);
    expect(result).toHaveProperty('Travel', 1);
  });

  test('getPostsByCategory returns posts filtered by category', () => {
    const result = getPostsByCategory('Tech');
    
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Test Post 1');
  });
});
