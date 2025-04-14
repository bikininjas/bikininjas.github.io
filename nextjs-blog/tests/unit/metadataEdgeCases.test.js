import { getPostData, getSortedPostsData } from '../../lib/posts';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

jest.mock('fs');
jest.mock('path');
jest.mock('gray-matter');
jest.mock('remark', () => ({
  remark: jest.fn().mockReturnValue({
    use: jest.fn().mockReturnThis(),
    process: jest.fn().mockResolvedValue({
      toString: jest.fn().mockReturnValue('<p>Test content</p>')
    })
  })
}));

describe('Post Metadata Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    path.join.mockImplementation((...args) => args.join('/'));
  });

  test('handles missing title', async () => {
    fs.readFileSync.mockReturnValue(`---
date: 2023-01-01
---
Content`);

    matter.mockReturnValue({
      data: { date: '2023-01-01' },
      content: 'Content'
    });

    const postData = await getPostData('test-post');
    expect(postData.title).toBe('Untitled');
  });

  test('handles empty frontmatter', async () => {
    fs.readFileSync.mockReturnValue(`---
---
Content`);

    matter.mockReturnValue({
      data: {},
      content: 'Content'
    });

    const postData = await getPostData('test-post');
    expect(postData.title).toBe('Untitled');
    expect(postData.categories).toEqual(['Uncategorized']);
  });

  test('handles malformed frontmatter', async () => {
    fs.readFileSync.mockReturnValue(`---
title: "Unclosed quote
date: invalid:date:format
---
Content`);

    matter.mockReturnValue({
      data: {},
      content: 'Content'
    });

    const postData = await getPostData('test-post');
    expect(postData.title).toBe('Untitled');
  });

  test('handles special characters in metadata', async () => {
    fs.readFileSync.mockReturnValue(`---
title: "Test & Special < > \\" Characters"
date: 2023-01-01
categories: ["Category & Special", "Test!"]
---
Content`);

    matter.mockReturnValue({
      data: {
        title: 'Test & Special < > " Characters',
        date: '2023-01-01',
        categories: ['Category & Special', 'Test!']
      },
      content: 'Content'
    });

    const postData = await getPostData('test-post');
    expect(postData.title).toBe('Test & Special < > " Characters');
    expect(postData.categories).toContain('Category & Special');
    expect(postData.categories).toContain('Test!');
  });

  test('handles mixed category formats in collection', () => {
    fs.readdirSync.mockReturnValue(['post1.md', 'post2.md', 'post3.md']);
    fs.readFileSync.mockImplementation((path) => {
      if (path.includes('post1')) {
        return `---
title: Post One
date: 2023-01-01
category: Single Category
---`;
      } else if (path.includes('post2')) {
        return `---
title: Post Two
date: 2023-01-02
categories: ["Array", "Category"]
---`;
      } else {
        return `---
title: Post Three
date: 2023-01-03
---`;
      }
    });

    const posts = getSortedPostsData();
    expect(posts).toHaveLength(3);
    expect(posts.find(p => p.id === 'post1').category).toBe('Single Category');
    expect(posts.find(p => p.id === 'post2').categories).toContain('Array');
    expect(posts.find(p => p.id === 'post3').categories).toContain('Uncategorized');
  });
});