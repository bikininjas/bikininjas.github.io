/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import Post, { getStaticProps, getStaticPaths } from '../../pages/posts/[id]';
import { getAllPostIds, getPostData, getAllCategories } from '../../lib/posts';

jest.mock('../../lib/posts', () => ({
  getAllPostIds: jest.fn(),
  getPostData: jest.fn(),
  getAllCategories: jest.fn()
}));

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

// Mock next/head
jest.mock('next/head', () => {
  return function MockHead({ children }) {
    return <div data-testid="mock-head">{children}</div>;
  };
});

describe('Post Page', () => {
  const mockPostData = {
    id: 'test-post',
    title: 'Test Post',
    date: '2023-01-01',
    contentHtml: '<p>Test content</p>'
  };

  const mockCategories = ['Tech', 'Gaming'];

  beforeEach(() => {
    getAllPostIds.mockReturnValue([
      { params: { id: 'test-post' } }
    ]);
    getPostData.mockResolvedValue(mockPostData);
    getAllCategories.mockReturnValue(mockCategories);
  });

  test('getStaticPaths returns correct paths', async () => {
    const paths = await getStaticPaths();
    expect(paths).toEqual({
      paths: [{ params: { id: 'test-post' } }],
      fallback: false
    });
  });

  test('getStaticProps returns post data and categories', async () => {
    const props = await getStaticProps({
      params: { id: 'test-post' }
    });

    expect(props).toEqual({
      props: {
        postData: mockPostData,
        categories: mockCategories
      }
    });
  });

  test('renders post content', () => {
    render(<Post postData={mockPostData} categories={mockCategories} />);
    
    expect(screen.getByTestId('mock-layout')).toBeInTheDocument();
    expect(screen.getByTestId('mock-post-content')).toHaveAttribute('title', mockPostData.title);
  });

  test('sets page title', () => {
    render(<Post postData={mockPostData} categories={mockCategories} />);
    
    const head = screen.getByTestId('mock-head');
    expect(head).toHaveTextContent(mockPostData.title);
  });

  test('passes categories to layout', () => {
    render(<Post postData={mockPostData} categories={mockCategories} />);
    
    const layout = screen.getByTestId('mock-layout');
    expect(layout).toBeInTheDocument();
  });
});