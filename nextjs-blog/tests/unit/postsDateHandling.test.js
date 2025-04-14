/**
 * @jest-environment jsdom
 */

import { getPostData, getSortedPostsData } from '../../lib/posts';
import fs from 'fs';
import path from 'path';

jest.mock('fs', () => ({
  readdirSync: jest.fn(),
  readFileSync: jest.fn(),
  existsSync: jest.fn()
}));

jest.mock('path', () => ({
  join: jest.fn(),
  resolve: jest.fn()
}));

jest.mock('gray-matter');

describe('Posts Date Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    path.join.mockImplementation((...args) => args.join('/'));
  });

  test('handles invalid date formats', async () => {
    fs.readFileSync.mockReturnValue(`---
title: Invalid Date Post
date: invalid-date-format
---
Content`);
    
    const postData = await getPostData('test-post');
    expect(postData.date).toBe('invalid-date-format');
  });

  test('handles missing dates', async () => {
    fs.readFileSync.mockReturnValue(`---
title: No Date Post
---
Content`);
    
    const postData = await getPostData('test-post');
    expect(postData.date).toBeUndefined();
  });

  test('handles future dates correctly', async () => {
    fs.readdirSync.mockReturnValue(['future-post.md', 'past-post.md']);
    fs.readFileSync.mockImplementation((path) => {
      if (path.includes('future-post')) {
        return `---
title: Future Post
date: 2025-01-01
---
Content`;
      } else {
        return `---
title: Past Post
date: 2020-01-01
---
Content`;
      }
    });

    const posts = getSortedPostsData();
    expect(posts[0].id).toBe('future-post');
    expect(posts[1].id).toBe('past-post');
  });
});