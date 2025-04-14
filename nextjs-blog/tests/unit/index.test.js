/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import Home, { getStaticProps } from '../../pages/index';
import { getSortedPostsData, getAllCategories } from '../../lib/posts';

jest.mock('../../lib/posts', () => ({
  getSortedPostsData: jest.fn(),
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

jest.mock('../../components/ParallaxHero', () => {
  return function MockHero() {
    return <div data-testid="mock-hero" />;
  };
});

jest.mock('../../components/PostCard', () => {
  return function MockPostCard({ post }) {
    return <div data-testid="mock-post-card">{post.title}</div>;
  };
});

describe('Home Page', () => {
  const mockPosts = [
    { id: 'post-1', title: 'Post 1', date: '2023-01-01' },
    { id: 'post-2', title: 'Post 2', date: '2023-01-02' }
  ];

  const mockCategories = ['Tech', 'Gaming'];

  beforeEach(() => {
    getSortedPostsData.mockReturnValue(mockPosts);
    getAllCategories.mockReturnValue(mockCategories);
  });

  test('getStaticProps returns posts and categories', async () => {
    const { props } = await getStaticProps();

    expect(props).toEqual({
      allPostsData: mockPosts,
      categories: mockCategories
    });
    expect(getSortedPostsData).toHaveBeenCalled();
    expect(getAllCategories).toHaveBeenCalled();
  });

  test('renders home page with posts', () => {
    render(<Home allPostsData={mockPosts} categories={mockCategories} />);

    expect(screen.getByTestId('mock-layout')).toBeInTheDocument();
    expect(screen.getByTestId('mock-hero')).toBeInTheDocument();
    mockPosts.forEach(post => {
      expect(screen.getByText(post.title)).toBeInTheDocument();
    });
  });

  test('displays section title', () => {
    render(<Home allPostsData={mockPosts} categories={mockCategories} />);
    expect(screen.getByText('Latest Posts')).toBeInTheDocument();
  });

  test('handles empty posts array', () => {
    render(<Home allPostsData={[]} categories={mockCategories} />);
    expect(screen.getByText('No posts found')).toBeInTheDocument();
  });

  test('sets page title', () => {
    render(<Home allPostsData={mockPosts} categories={mockCategories} />);
    const head = screen.getByTestId('mock-head');
    expect(head).toHaveTextContent('BikiNinjas Blog');
  });
});