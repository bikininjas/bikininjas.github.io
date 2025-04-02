import { getPostData } from '../../lib/posts';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Mock des modules
jest.mock('fs');
jest.mock('path');
jest.mock('gray-matter');
jest.mock('remark', () => {
  return {
    remark: jest.fn().mockReturnValue({
      use: jest.fn().mockReturnThis(),
      process: jest.fn().mockResolvedValue({
        toString: jest.fn().mockReturnValue('<p>Test content</p>')
      })
    })
  };
});

// Mock de la fonction processEmbeds
jest.mock('../../lib/posts', () => {
  const originalModule = jest.requireActual('../../lib/posts');
  return {
    ...originalModule,
    processEmbeds: jest.fn(content => content)
  };
});

describe('getPostData function edge cases', () => {
  // Configuration des mocks avant chaque test
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock de path.join
    path.join.mockImplementation((...args) => args.join('/'));
    
    // Mock de fs.readFileSync
    fs.readFileSync.mockReturnValue('---\ntitle: Test Post\ndate: 2023-01-01\n---\nTest content');
    
    // Mock de matter
    matter.mockReturnValue({
      data: {
        title: 'Test Post',
        date: '2023-01-01'
      },
      content: 'Test content'
    });
  });

  it('handles posts with embedded content correctly', async () => {
    // Configurer le mock pour simuler un contenu avec des embeds
    const contentWithEmbeds = 'Before embed <div class="embed-container">Embed content</div> After embed';
    matter.mockReturnValueOnce({
      data: { title: 'Post with Embeds', date: '2023-01-01' },
      content: contentWithEmbeds
    });
    
    // Mock de processEmbeds pour retourner le contenu avec embeds
    const originalProcessEmbeds = jest.requireMock('../../lib/posts').processEmbeds;
    originalProcessEmbeds.mockReturnValueOnce(contentWithEmbeds);
    
    const postData = await getPostData('post-with-embeds');
    
    expect(postData.contentHtml).toContain('<div class="embed-container">');
    expect(postData.title).toBe('Post with Embeds');
  });

  it('handles posts with multiple categories as array', async () => {
    matter.mockReturnValueOnce({
      data: {
        title: 'Multi-Category Post',
        date: '2023-01-01',
        categories: ['Category One', 'Category Two']
      },
      content: 'Test content'
    });
    
    const postData = await getPostData('multi-category-post');
    
    expect(postData.categories).toEqual(['Category One', 'Category Two']);
    expect(postData.category).toBe('Category One');
    expect(postData.categorySlug).toBe('category-one');
  });

  it('handles posts with a single category as string', async () => {
    matter.mockReturnValueOnce({
      data: {
        title: 'Single Category Post',
        date: '2023-01-01',
        category: 'Single Category'
      },
      content: 'Test content'
    });
    
    const postData = await getPostData('single-category-post');
    
    expect(postData.categories).toEqual(['Single Category']);
    expect(postData.category).toBe('Single Category');
    expect(postData.categorySlug).toBe('single-category');
  });

  it('handles posts with no category', async () => {
    matter.mockReturnValueOnce({
      data: {
        title: 'No Category Post',
        date: '2023-01-01'
      },
      content: 'Test content'
    });
    
    const postData = await getPostData('no-category-post');
    
    expect(postData.categories).toEqual(['Uncategorized']);
    expect(postData.category).toBe('Uncategorized');
    expect(postData.categorySlug).toBe('uncategorized');
  });

  it('handles posts with category as array but using for backward compatibility', async () => {
    matter.mockReturnValueOnce({
      data: {
        title: 'Backward Compatibility Post',
        date: '2023-01-01',
        category: ['Old Category', 'Another Category']
      },
      content: 'Test content'
    });
    
    const postData = await getPostData('backward-compatibility-post');
    
    expect(postData.categories).toEqual(['Old Category', 'Another Category']);
    expect(postData.category).toBe('Old Category');
    expect(postData.categorySlug).toBe('old-category');
  });
});
