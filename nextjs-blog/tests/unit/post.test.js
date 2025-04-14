import React from 'react';
import { render, screen } from '@testing-library/react';
import Post, { getStaticProps, getStaticPaths } from '../../pages/posts/[id]';
import * as postsLib from '../../lib/posts';

jest.mock('../../lib/posts', () => ({
  getAllPostIds: jest.fn(),
  getPostData: jest.fn(),
  getAllCategories: jest.fn()
}));

jest.mock('../../components/layout', () => {
  return function MockLayout({ children }) {
    return <div data-testid="mock-layout">{children}</div>;
  };
});

jest.mock('../../components/PostContent', () => {
  return function MockPostContent({ post }) {
    return <div data-testid="mock-post-content">{post.title}</div>;
  };
});

describe('Post Page', () => {
  const mockPost = {
    id: 'test-post',
    title: 'Test Post',
    date: '2023-01-01',
    contentHtml: '<p>Test content</p>',
    category: 'Test Category',
    categorySlug: 'test-category',
    readTime: '5 min read'
  };

  const mockCategories = ['Test Category', 'Other Category'];

  beforeEach(() => {
    jest.clearAllMocks();
    postsLib.getPostData.mockResolvedValue(mockPost);
    postsLib.getAllCategories.mockResolvedValue(mockCategories);
  });

  test('renders post page with content', () => {
    render(<Post postData={mockPost} categories={mockCategories} />);
    
    expect(screen.getByTestId('mock-layout')).toBeInTheDocument();
    expect(screen.getByTestId('mock-post-content')).toHaveTextContent(mockPost.title);
  });

  test('getStaticPaths returns all post paths', async () => {
    const mockPaths = [
      { params: { id: 'post-1' } },
      { params: { id: 'post-2' } }
    ];
    postsLib.getAllPostIds.mockResolvedValue(mockPaths);

    const { paths, fallback } = await getStaticPaths();
    expect(paths).toEqual(mockPaths);
    expect(fallback).toBe(false);
  });

  test('getStaticProps returns post data and categories', async () => {
    const params = { id: 'test-post' };
    const { props } = await getStaticProps({ params });

    expect(props).toEqual({
      postData: mockPost,
      categories: mockCategories
    });

    expect(postsLib.getPostData).toHaveBeenCalledWith(params.id);
    expect(postsLib.getAllCategories).toHaveBeenCalled();
  });

  test('handles metadata in post content', () => {
    const postWithMetadata = {
      ...mockPost,
      author: 'Test Author',
      description: 'Test Description'
    };

    render(<Post postData={postWithMetadata} categories={mockCategories} />);
    const layout = screen.getByTestId('mock-layout');
    expect(layout).toBeInTheDocument();
  });

  test('handles missing optional metadata', () => {
    const minimalPost = {
      id: 'test-post',
      title: 'Test Post',
      contentHtml: '<p>Test content</p>'
    };

    render(<Post postData={minimalPost} categories={mockCategories} />);
    expect(screen.getByTestId('mock-post-content')).toBeInTheDocument();
  });

  test('throws error when required props are missing', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Post />)).toThrow();
    consoleSpy.mockRestore();
  });

  test('handles error in getStaticProps', async () => {
    postsLib.getPostData.mockRejectedValue(new Error('Failed to fetch'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const params = { id: 'error-post' };
    await expect(getStaticProps({ params })).rejects.toThrow('Failed to fetch');
    
    consoleSpy.mockRestore();
  });

  test('handles malformed post data', () => {
    const malformedPost = {
      id: 'test-post',
      title: null,
      contentHtml: undefined
    };

    render(<Post postData={malformedPost} categories={mockCategories} />);
    expect(screen.getByTestId('mock-post-content')).toBeInTheDocument();
  });
});