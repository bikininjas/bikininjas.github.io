/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import CategoryPage, { getStaticProps, getStaticPaths } from '../../pages/categories/[category]';
import { getAllCategorySlugs, getPostsByCategorySlug, getCategoryFromSlug } from '../../lib/posts';

jest.mock('../../lib/posts', () => ({
  getAllCategorySlugs: jest.fn(),
  getPostsByCategorySlug: jest.fn(),
  getCategoryFromSlug: jest.fn(),
  getAllCategories: jest.fn()
}));

// Mock components
jest.mock('../../components/layout', () => {
  return function MockLayout({ children }) {
    return <div data-testid="mock-layout">{children}</div>;
  };
});

jest.mock('../../components/PostCard', () => {
  return function MockPostCard({ post }) {
    return <div data-testid="mock-post-card">{post.title}</div>;
  };
});

describe('Category Page', () => {
  const mockCategory = 'Test Category';
  const mockPosts = [
    { id: 'post-1', title: 'Post 1', date: '2023-01-01' },
    { id: 'post-2', title: 'Post 2', date: '2023-01-02' }
  ];
  const mockCategories = ['Test Category', 'Other Category'];

  beforeEach(() => {
    getAllCategorySlugs.mockReturnValue(['test-category', 'other-category']);
    getPostsByCategorySlug.mockReturnValue(mockPosts);
    getCategoryFromSlug.mockReturnValue(mockCategory);
  });

  test('getStaticPaths returns all category paths', async () => {
    const paths = await getStaticPaths();
    expect(paths).toEqual({
      paths: [
        { params: { category: 'test-category' } },
        { params: { category: 'other-category' } }
      ],
      fallback: false
    });
  });

  test('getStaticProps returns category data', async () => {
    const props = await getStaticProps({
      params: { category: 'test-category' }
    });

    expect(props).toEqual({
      props: {
        posts: mockPosts,
        currentCategory: mockCategory,
        categories: mockCategories
      }
    });
  });

  test('renders category page with posts', () => {
    render(
      <CategoryPage
        posts={mockPosts}
        currentCategory={mockCategory}
        categories={mockCategories}
      />
    );

    expect(screen.getByTestId('mock-layout')).toBeInTheDocument();
    mockPosts.forEach(post => {
      expect(screen.getByText(post.title)).toBeInTheDocument();
    });
  });

  test('displays category title', () => {
    render(
      <CategoryPage
        posts={mockPosts}
        currentCategory={mockCategory}
        categories={mockCategories}
      />
    );

    expect(screen.getByText(/Articles in/i)).toBeInTheDocument();
    expect(screen.getByText(mockCategory)).toBeInTheDocument();
  });

  test('handles empty posts array', () => {
    render(
      <CategoryPage
        posts={[]}
        currentCategory={mockCategory}
        categories={mockCategories}
      />
    );

    expect(screen.getByText(/No posts found/i)).toBeInTheDocument();
  });
});