import React from 'react';
import { render, screen } from '@testing-library/react';
import Home, { getStaticProps } from '../../pages/index';
import * as postsLib from '../../lib/posts';

jest.mock('../../lib/posts', () => ({
  getSortedPostsData: jest.fn(),
  getAllCategories: jest.fn()
}));

jest.mock('../../components/layout', () => {
  return function MockLayout({ children }) {
    return <div data-testid="mock-layout">{children}</div>;
  };
});

jest.mock('../../components/ParallaxHero', () => {
  return function MockParallaxHero({ title, subtitle }) {
    return <div data-testid="mock-hero">{title} - {subtitle}</div>;
  };
});

jest.mock('../../components/CategoryNav', () => {
  return function MockCategoryNav({ categories }) {
    return <div data-testid="mock-nav">{categories.join(', ')}</div>;
  };
});

describe('Home Page', () => {
  const mockPosts = [
    {
      id: 'post-1',
      title: 'First Post',
      date: '2023-01-01',
      excerpt: 'First excerpt',
      category: 'Tech'
    },
    {
      id: 'post-2',
      title: 'Second Post',
      date: '2023-01-02',
      excerpt: 'Second excerpt',
      category: 'Gaming'
    }
  ];

  const mockCategories = ['Tech', 'Gaming', 'Development'];

  beforeEach(() => {
    jest.clearAllMocks();
    postsLib.getSortedPostsData.mockReturnValue(mockPosts);
    postsLib.getAllCategories.mockReturnValue(mockCategories);
  });

  test('renders home page with all components', () => {
    render(<Home allPostsData={mockPosts} categories={mockCategories} />);

    expect(screen.getByTestId('mock-layout')).toBeInTheDocument();
    expect(screen.getByTestId('mock-hero')).toBeInTheDocument();
    expect(screen.getByTestId('mock-nav')).toBeInTheDocument();

    // Check posts are rendered
    mockPosts.forEach(post => {
      expect(screen.getByText(post.title)).toBeInTheDocument();
      expect(screen.getByText(post.excerpt)).toBeInTheDocument();
      expect(screen.getByText(post.category)).toBeInTheDocument();
    });
  });

  test('getStaticProps returns posts and categories', async () => {
    const { props } = await getStaticProps();

    expect(props).toEqual({
      allPostsData: mockPosts,
      categories: mockCategories
    });

    expect(postsLib.getSortedPostsData).toHaveBeenCalled();
    expect(postsLib.getAllCategories).toHaveBeenCalled();
  });

  test('handles empty posts array', () => {
    render(<Home allPostsData={[]} categories={mockCategories} />);
    expect(screen.getByText('No posts found.')).toBeInTheDocument();
  });

  test('renders correct hero content', () => {
    render(<Home allPostsData={mockPosts} categories={mockCategories} />);
    const hero = screen.getByTestId('mock-hero');
    expect(hero).toHaveTextContent('BikiNinjas');
    expect(hero).toHaveTextContent('Gaming, Development & Digital Wellbeing');
  });

  test('renders posts in correct order', () => {
    render(<Home allPostsData={mockPosts} categories={mockCategories} />);
    const postTitles = screen.getAllByRole('heading', { level: 2 });
    expect(postTitles[0]).toHaveTextContent('Second Post'); // Most recent first
    expect(postTitles[1]).toHaveTextContent('First Post');
  });

  test('throws error when required props are missing', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Home />)).toThrow();
    consoleSpy.mockRestore();
  });

  test('handles failed data fetching in getStaticProps', async () => {
    postsLib.getSortedPostsData.mockImplementation(() => {
      throw new Error('Fetch error');
    });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const { props } = await getStaticProps();

    expect(props).toEqual({
      allPostsData: [],
      categories: mockCategories
    });
    consoleSpy.mockRestore();
  });
});