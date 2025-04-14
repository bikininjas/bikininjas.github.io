/**
 * @jest-environment jsdom
 */

import { getPostData } from '../../lib/posts';
import fs from 'fs';
import path from 'path';

jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  existsSync: jest.fn()
}));

jest.mock('path', () => ({
  join: jest.fn()
}));

// Mock remark and its process method
jest.mock('remark', () => {
  const mockProcess = jest.fn().mockImplementation((content) => {
    // Simulate HTML conversion for markdown
    let htmlContent = content;
    // Convert headers
    htmlContent = htmlContent.replace(/^# (.*)$/gm, '<h1>$1</h1>');
    htmlContent = htmlContent.replace(/^## (.*)$/gm, '<h2>$1</h2>');
    // Convert paragraphs
    htmlContent = htmlContent.replace(/^([^<#].*)$/gm, '<p>$1</p>');
    // Convert bold
    htmlContent = htmlContent.replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>');
    // Convert italic
    htmlContent = htmlContent.replace(/\*(.*)\*/g, '<em>$1</em>');
    
    return {
      toString: () => htmlContent
    };
  });
  
  return {
    remark: jest.fn().mockImplementation(() => {
      return {
        use: jest.fn().mockImplementation(() => {
          return {
            process: mockProcess
          };
        })
      };
    })
  };
});

// Mock console.log to prevent output during tests
global.console.log = jest.fn();

describe('getPostData function', () => {
  // Setup before each test
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock path.join to return predictable paths
    path.join.mockImplementation((...args) => {
      return args.join('/');
    });
    
    // Mock process.cwd() to return a fixed path
    jest.spyOn(process, 'cwd').mockReturnValue('/test-dir');
  });

  it('processes a simple post without embeds', async () => {
    // Mock the file content
    fs.readFileSync.mockReturnValue(`---
title: "Simple Post"
date: "2023-01-01"
excerpt: "A simple post without embeds"
---
# Simple Post

This is a simple post without any embeds.`);

    const postData = await getPostData('simple-post');
    
    expect(postData.title).toBe('Simple Post');
    expect(postData.date).toBe('2023-01-01');
    expect(postData.excerpt).toBe('A simple post without embeds');
    expect(postData.contentHtml).toContain('<h1>Simple Post</h1>');
    // Le format exact peut varier, vérifions juste que le contenu est présent
    expect(postData.contentHtml).toContain('This is a simple post without any embeds');
    expect(postData.category).toBe('Uncategorized');
    expect(postData.categories).toEqual(['Uncategorized']);
  });

  it('processes a post with a single category', async () => {
    // Mock the file content
    fs.readFileSync.mockReturnValue(`---
title: "Category Post"
date: "2023-01-02"
excerpt: "A post with a single category"
category: "Test Category"
---
# Category Post

This is a post with a single category.`);

    const postData = await getPostData('category-post');
    
    expect(postData.title).toBe('Category Post');
    expect(postData.category).toBe('Test Category');
    expect(postData.categories).toEqual(['Test Category']);
    expect(postData.categorySlug).toBe('test-category');
  });

  it('processes a post with multiple categories', async () => {
    // Mock the file content
    fs.readFileSync.mockReturnValue(`---
title: "Multi-Category Post"
date: "2023-01-03"
excerpt: "A post with multiple categories"
categories: ["Category One", "Category Two"]
---
# Multi-Category Post

This is a post with multiple categories.`);

    const postData = await getPostData('multi-category-post');
    
    expect(postData.title).toBe('Multi-Category Post');
    expect(postData.categories).toEqual(['Category One', 'Category Two']);
    expect(postData.category).toBe('Category One');
    expect(postData.categorySlug).toBe('category-one');
  });

  it('processes a post with YouTube embed', async () => {
    // Mock the file content
    fs.readFileSync.mockReturnValue(`---
title: "YouTube Post"
date: "2023-01-04"
excerpt: "A post with a YouTube embed"
---
# YouTube Post

Check out this video:

![youtube](https://youtu.be/abcd1234 "Test Video")`);

    const postData = await getPostData('youtube-post');
    
    expect(postData.title).toBe('YouTube Post');
    expect(postData.contentHtml).toContain('<div class="embed-container video-container">');
    expect(postData.contentHtml).toContain('<lite-youtube videoid="abcd1234"');
    expect(postData.contentHtml).toContain('playlabel="Test Video"');
  });

  it('processes a post with Twitch embed', async () => {
    // Mock NODE_ENV for the test
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    // Mock the file content
    fs.readFileSync.mockReturnValue(`---
title: "Twitch Post"
date: "2023-01-05"
excerpt: "A post with a Twitch embed"
---
# Twitch Post

Check out this stream:

![twitch](https://twitch.tv/testchannel "Test Channel")`);

    const postData = await getPostData('twitch-post');
    
    expect(postData.title).toBe('Twitch Post');
    expect(postData.contentHtml).toContain('<div class="embed-container twitch-container">');
    expect(postData.contentHtml).toContain('src="https://player.twitch.tv/?channel=testchannel&parent=localhost"');
    
    // Restore NODE_ENV
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('processes a post with Bluesky embed', async () => {
    // Mock the file content
    fs.readFileSync.mockReturnValue(`---
title: "Bluesky Post"
date: "2023-01-06"
excerpt: "A post with a Bluesky embed"
---
# Bluesky Post

Check out this post:

![bluesky](https://bsky.app/profile/test.bsky.social/post/abcd1234)`);

    const postData = await getPostData('bluesky-post');
    
    expect(postData.title).toBe('Bluesky Post');
    expect(postData.contentHtml).toContain('<div class="bluesky-embed-container">');
    expect(postData.contentHtml).toContain('src="https://bsky.app/embed?url=');
    expect(postData.contentHtml).toContain(encodeURIComponent('https://bsky.app/profile/test.bsky.social/post/abcd1234'));
  });

  it('processes a post with multiple embeds and markdown content', async () => {
    // Mock the file content
    fs.readFileSync.mockReturnValue(`---
title: "Mixed Content Post"
date: "2023-01-07"
excerpt: "A post with mixed content"
categories: ["Media", "Test"]
---
# Mixed Content Post

Here's some **bold text** and *italic text*.

## YouTube Video
![youtube](https://youtu.be/abcd1234 "Test Video")

## Twitch Stream
![twitch](https://twitch.tv/testchannel "Test Channel")

## Bluesky Post
![bluesky](https://bsky.app/profile/test.bsky.social/post/abcd1234)

And some more regular markdown.`);

    const postData = await getPostData('mixed-content-post');
    
    expect(postData.title).toBe('Mixed Content Post');
    expect(postData.categories).toEqual(['Media', 'Test']);
    
    // Check that markdown is processed
    expect(postData.contentHtml).toContain('<h1>Mixed Content Post</h1>');
    expect(postData.contentHtml).toContain('<strong>bold text</strong>');
    expect(postData.contentHtml).toContain('<em>italic text</em>');
    
    // Check that embeds are processed
    expect(postData.contentHtml).toContain('<div class="embed-container video-container">');
    expect(postData.contentHtml).toContain('<div class="embed-container twitch-container">');
    expect(postData.contentHtml).toContain('<div class="bluesky-embed-container">');
  });
});
