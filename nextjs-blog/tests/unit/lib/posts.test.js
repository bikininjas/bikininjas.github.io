/**
 * @jest-environment jsdom
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getAllPostIds, getPostData, getSortedPostsData } from '../../../lib/posts';

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

jest.mock('gray-matter', () => jest.fn());

describe('Posts Library', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    path.join.mockImplementation((...args) => args.join('/'));
  });

  describe('getAllPostIds', () => {
    it('returns post IDs from markdown files', () => {
      fs.readdirSync.mockReturnValue(['post1.md', 'post2.md']);

      const ids = getAllPostIds();
      expect(ids).toEqual([
        { params: { id: 'post1' } },
        { params: { id: 'post2' } }
      ]);
    });

    it('handles empty directory', () => {
      fs.readdirSync.mockReturnValue([]);
      const ids = getAllPostIds();
      expect(ids).toEqual([]);
    });
  });

  describe('getPostData', () => {
    beforeEach(() => {
      matter.mockReturnValue({
        data: {
          title: 'Test Post',
          date: '2023-01-01'
        },
        content: 'Test content'
      });
    });

    it('processes post data correctly', async () => {
      const postData = await getPostData('test-post');
      expect(postData).toHaveProperty('id', 'test-post');
      expect(postData).toHaveProperty('title', 'Test Post');
      expect(postData).toHaveProperty('date', '2023-01-01');
      expect(postData).toHaveProperty('contentHtml');
    });

    it('processes embeds in content', async () => {
      matter.mockReturnValue({
        data: { title: 'Test Post' },
        content: '![youtube](https://youtu.be/abc123 "Test Video")'
      });

      const postData = await getPostData('test-post');
      expect(postData.contentHtml).toContain('lite-youtube');
      expect(postData.contentHtml).toContain('videoid="abc123"');
    });
  });

  describe('getSortedPostsData', () => {
    beforeEach(() => {
      fs.readdirSync.mockReturnValue(['post1.md', 'post2.md']);
      fs.readFileSync.mockImplementation((path) => {
        if (path.includes('post1')) {
          return '---\ntitle: Post 1\ndate: 2023-01-02\n---\nContent 1';
        }
        return '---\ntitle: Post 2\ndate: 2023-01-01\n---\nContent 2';
      });
      matter.mockImplementation((content) => ({
        data: content.includes('Post 1') 
          ? { title: 'Post 1', date: '2023-01-02' }
          : { title: 'Post 2', date: '2023-01-01' },
        content: content.includes('Content 1') ? 'Content 1' : 'Content 2'
      }));
    });

    it('returns sorted posts data', () => {
      const posts = getSortedPostsData();
      expect(posts[0].title).toBe('Post 1'); // More recent date
      expect(posts[1].title).toBe('Post 2'); // Older date
    });

    it('handles missing dates', () => {
      matter.mockReturnValue({
        data: { title: 'Post' },
        content: 'Content'
      });

      const posts = getSortedPostsData();
      expect(posts).toHaveLength(2);
    });
  });
});