import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getAllPostIds, getPostData, getSortedPostsData } from '../../../lib/posts';

jest.mock('fs');
jest.mock('gray-matter');

describe('Posts Library', () => {
  const mockPosts = [
    {
      id: 'post-1',
      title: 'Test Post 1',
      date: '2023-01-01',
      category: 'Technology'
    },
    {
      id: 'post-2',
      title: 'Test Post 2',
      date: '2023-01-02',
      category: 'Development'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    fs.readdirSync.mockReturnValue(['post-1.md', 'post-2.md']);
    fs.readFileSync.mockReturnValue('---\ntitle: Test\n---\ncontent');
    matter.mockReturnValue({
      data: { title: 'Test', date: '2023-01-01' },
      content: 'Test content'
    });
  });

  describe('getAllPostIds', () => {
    test('returns correct post IDs', () => {
      const ids = getAllPostIds();
      expect(ids).toEqual([
        { params: { id: 'post-1' } },
        { params: { id: 'post-2' } }
      ]);
    });

    test('handles fs read error', () => {
      fs.readdirSync.mockImplementation(() => {
        throw new Error('Read directory failed');
      });
      expect(() => getAllPostIds()).toThrow('Failed to get post IDs');
    });

    test('handles empty directory', () => {
      fs.readdirSync.mockReturnValue([]);
      const ids = getAllPostIds();
      expect(ids).toEqual([]);
    });
  });

  describe('getPostData', () => {
    test('returns post data with processed markdown', async () => {
      const data = await getPostData('post-1');
      expect(data).toHaveProperty('id', 'post-1');
      expect(data).toHaveProperty('contentHtml');
    });

    test('handles missing markdown file', async () => {
      fs.readFileSync.mockImplementation(() => {
        throw new Error('File not found');
      });
      await expect(getPostData('invalid-post')).rejects.toThrow('Failed to get post data');
    });

    test('handles invalid frontmatter', async () => {
      matter.mockImplementation(() => {
        throw new Error('Invalid frontmatter');
      });
      await expect(getPostData('post-1')).rejects.toThrow('Failed to parse post metadata');
    });

    test('handles missing required metadata', async () => {
      matter.mockReturnValue({
        data: {},
        content: 'Test content'
      });
      await expect(getPostData('post-1')).rejects.toThrow('Missing required metadata');
    });

    test('handles markdown processing error', async () => {
      matter.mockReturnValue({
        data: { title: 'Test', date: '2023-01-01' },
        content: null
      });
      await expect(getPostData('post-1')).rejects.toThrow('Failed to process markdown content');
    });
  });

  describe('getSortedPostsData', () => {
    test('returns sorted posts data', () => {
      fs.readFileSync.mockImplementation((path) => {
        const id = path.includes('post-1') ? 'post-1' : 'post-2';
        return `---\ntitle: Test ${id}\ndate: 2023-01-0${id.slice(-1)}\n---\ncontent`;
      });

      const posts = getSortedPostsData();
      expect(posts).toHaveLength(2);
      expect(posts[0].date).toBe('2023-01-02');
      expect(posts[1].date).toBe('2023-01-01');
    });

    test('handles fs read error', () => {
      fs.readdirSync.mockImplementation(() => {
        throw new Error('Read directory failed');
      });
      expect(() => getSortedPostsData()).toThrow('Failed to get posts data');
    });

    test('handles invalid post file', () => {
      fs.readFileSync.mockImplementationOnce(() => {
        throw new Error('File read failed');
      });
      const posts = getSortedPostsData();
      expect(posts).toHaveLength(1);
    });

    test('handles invalid date format', () => {
      matter.mockReturnValueOnce({
        data: { title: 'Test', date: 'invalid-date' },
        content: 'content'
      });
      const posts = getSortedPostsData();
      expect(posts[0].date).toBe('invalid-date');
    });

    test('filters out posts with missing required metadata', () => {
      matter.mockReturnValueOnce({
        data: {},
        content: 'content'
      });
      const posts = getSortedPostsData();
      expect(posts).toHaveLength(1);
    });
  });
});