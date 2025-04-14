/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import Post, { getStaticProps, getStaticPaths } from '../../pages/posts/[id]';
import { getAllPostIds, getPostData } from '../../lib/posts';

jest.mock('../../lib/posts', () => ({
  getAllPostIds: jest.fn(),
  getPostData: jest.fn(),
  getAllCategories: jest.fn()
}));

// Mock next/head
jest.mock('next/head', () => {
  return function MockHead({ children }) {
    return <div data-testid="mock-head">{children}</div>;
  };
});

// Mock components
jest.mock('../../components/layout', () => {
  return function MockLayout({ children }) {
    return <div data-testid="mock-layout">{children}</div>;
  };
});

jest.mock('../../components/PostContent', () => {
  return function MockPostContent(props) {
    return <div data-testid="mock-post-content" {...props} />;
  };
});

describe('Post Page', () => {
  const mockPost = {
    id: 'test-post',
    title: 'Test Post',
    date: '2023-01-01',
    contentHtml: '<p>Test content</p>'
  };

  const mockCategories = ['Tech', 'Gaming'];

  beforeEach(() => {
    getAllPostIds.mockReturnValue([
      { params: { id: 'test-post' } },
      { params: { id: 'another-post' } }
    ]);
    getPostData.mockResolvedValue(mockPost);
    getAllCategories.mockReturnValue(mockCategories);
  });

  test('getStaticPaths returns all post paths', async () => {
    const paths = await getStaticPaths();
    expect(paths).toEqual({
      paths: [
        { params: { id: 'test-post' } },
        { params: { id: 'another-post' } }
      ],
      fallback: false
    });
    expect(getAllPostIds).toHaveBeenCalled();
  });

  test('getStaticProps returns post data', async () => {
    const props = await getStaticProps({
      params: { id: 'test-post' }
    });

    expect(props).toEqual({
      props: {
        postData: mockPost,
        categories: mockCategories
      }
    });
    expect(getPostData).toHaveBeenCalledWith('test-post');
  });

  test('renders post page with content', () => {
    render(
      <Post
        postData={mockPost}
        categories={mockCategories}
      />
    );

    expect(screen.getByTestId('mock-layout')).toBeInTheDocument();
    expect(screen.getByTestId('mock-post-content')).toBeInTheDocument();
  });

  test('passes correct props to PostContent', () => {
    render(
      <Post
        postData={mockPost}
        categories={mockCategories}
      />
    );

    const postContent = screen.getByTestId('mock-post-content');
    expect(postContent).toHaveAttribute('title', mockPost.title);
    expect(postContent).toHaveAttribute('date', mockPost.date);
    expect(postContent).toHaveAttribute('contentHtml', mockPost.contentHtml);
  });

  test('sets page title correctly', () => {
    render(
      <Post
        postData={mockPost}
        categories={mockCategories}
      />
    );

    const head = screen.getByTestId('mock-head');
    expect(head).toHaveTextContent(mockPost.title);
  });

  test('handles missing post data', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Post categories={mockCategories} />)).toThrow();
    consoleSpy.mockRestore();
  });

  test('handles missing categories', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Post postData={mockPost} />)).toThrow();
    consoleSpy.mockRestore();
  });
});