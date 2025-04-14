/**
 * @jest-environment jsdom
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getAllPostIds, getPostData, getSortedPostsData } from '../../../lib/posts';

describe('Posts Library', () => {
  // Setup before each test
  beforeEach(() => {
    // Mock fs methods
    jest.spyOn(fs, 'readdirSync').mockImplementation(() => ['post1.md', 'post2.md']);
    jest.spyOn(fs, 'readFileSync').mockImplementation((filePath) => {
      if (filePath.includes('post1')) {
        return `---
title: 'Test Post 1'
date: '2022-01-01'
---
Test content 1`;
      }
      return `---
title: 'Test Post 2'
date: '2022-01-02'
---
Test content 2`;
    });
    jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
    
    // Mock path methods
    jest.spyOn(path, 'join').mockImplementation((...args) => args.join('/'));
    jest.spyOn(path, 'parse').mockImplementation((filePath) => {
      const parts = filePath.split('/');
      const filename = parts[parts.length - 1];
      return { 
        name: filename.replace('.md', ''),
        ext: '.md'
      };
    });
  });

  // Clean up after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('getSortedPostsData returns posts sorted by date', () => {
    const result = getSortedPostsData();
    
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('Test Post 2');
    expect(result[1].title).toBe('Test Post 1');
  });

  test('getAllPostIds returns formatted ids', () => {
    const result = getAllPostIds();
    
    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty('params');
    expect(result[0].params).toHaveProperty('id', 'post1');
    expect(result[1].params).toHaveProperty('id', 'post2');
  });

  test('getPostData returns post data with content', async () => {
    const result = await getPostData('post1');
    
    expect(result).toHaveProperty('id', 'post1');
    expect(result).toHaveProperty('title', 'Test Post 1');
    expect(result).toHaveProperty('date', '2022-01-01');
    expect(result).toHaveProperty('contentHtml');
  });
});