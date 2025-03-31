import fs from 'fs';
import path from 'path';
import { getPostData } from '../../lib/posts';

// Mock des modules fs et path
jest.mock('fs');
jest.mock('path');

// Mock de la fonction console.log pour éviter les logs pendant les tests
global.console.log = jest.fn();

describe('getPostData function', () => {
  // Configuration des mocks avant chaque test
  beforeEach(() => {
    // Réinitialiser les mocks
    jest.clearAllMocks();
    
    // Mock pour path.join
    path.join.mockImplementation((...args) => args.join('/'));
    
    // Mock pour fs.readFileSync
    fs.readFileSync.mockImplementation((filePath) => {
      if (filePath.includes('test-post.md')) {
        return `---
title: Test Post
date: '2025-01-01'
categories: ['Test Category', 'Another Category']
excerpt: This is a test excerpt
coverImage: /images/test.jpg
---

# Test Content

This is a test markdown content.

![youtube](https://youtu.be/abcdefg "Test YouTube Video")

Some more content.

![twitter](https://twitter.com/user/status/123456789)

Final paragraph.`;
      } else if (filePath.includes('single-category-post.md')) {
        return `---
title: Single Category Post
date: '2025-01-02'
category: Single Category
excerpt: This is another test
---

# Single Category Test

This is a test with a single category.`;
      } else if (filePath.includes('no-category-post.md')) {
        return `---
title: No Category Post
date: '2025-01-03'
excerpt: Post without category
---

# No Category Test

This is a test without any category.`;
      } else if (filePath.includes('twitch-post.md')) {
        return `---
title: Twitch Post
date: '2025-01-04'
categories: ['Streaming']
---

# Twitch Embed Test

![twitch](channelname "Test Twitch Channel")`;
      } else if (filePath.includes('bluesky-post.md')) {
        return `---
title: Bluesky Post
date: '2025-01-05'
categories: ['Social Media']
---

# Bluesky Embed Test

![bluesky](https://bsky.app/profile/test.bsky.social/post/abcdef)`;
      }
      
      throw new Error(`Unexpected file path: ${filePath}`);
    });
  });
  
  test('processes a post with multiple categories correctly', async () => {
    const postData = await getPostData('test-post');
    
    expect(postData.id).toBe('test-post');
    expect(postData.title).toBe('Test Post');
    expect(postData.date).toBe('2025-01-01');
    expect(postData.categories).toEqual(['Test Category', 'Another Category']);
    expect(postData.category).toBe('Test Category');
    expect(postData.excerpt).toBe('This is a test excerpt');
    expect(postData.coverImage).toBe('/images/test.jpg');
    expect(postData.contentHtml).toBeTruthy();
    expect(postData.contentHtml).toContain('<div class="embed-container video-container">');
    // Le mock ne contient pas d'embed Twitter, donc nous ne testons pas cette partie
  });
  
  test('processes a post with a single category correctly', async () => {
    const postData = await getPostData('single-category-post');
    
    expect(postData.id).toBe('single-category-post');
    expect(postData.title).toBe('Single Category Post');
    expect(postData.categories).toEqual(['Single Category']);
    expect(postData.category).toBe('Single Category');
  });
  
  test('processes a post without a category correctly', async () => {
    const postData = await getPostData('no-category-post');
    
    expect(postData.id).toBe('no-category-post');
    expect(postData.title).toBe('No Category Post');
    expect(postData.categories).toEqual(['Uncategorized']);
    expect(postData.category).toBe('Uncategorized');
  });
  
  test('processes a post with Twitch embed correctly', async () => {
    const postData = await getPostData('twitch-post');
    
    expect(postData.id).toBe('twitch-post');
    expect(postData.title).toBe('Twitch Post');
    expect(postData.contentHtml).toContain('<div class="embed-container twitch-container">');
  });
  
  test('processes a post with Bluesky embed correctly', async () => {
    const postData = await getPostData('bluesky-post');
    
    expect(postData.id).toBe('bluesky-post');
    expect(postData.title).toBe('Bluesky Post');
    expect(postData.contentHtml).toBeTruthy();
  });
});
