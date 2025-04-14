/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import Category, { getStaticProps, getStaticPaths } from '../../pages/categories/[category]';
import { getAllCategorySlugs, getPostsByCategorySlug, getCategoryFromSlug } from '../../lib/posts';

jest.mock('../../lib/posts', () => ({
  getAllCategorySlugs: jest.fn(),
  getPostsByCategorySlug: jest.fn(),
  getCategoryFromSlug: jest.fn(),
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

describe('Category Page', () => {
  const mockPosts = [
    { id: 'post-1', title: 'Test Post 1', date: '2023-01-01' },
    { id: 'post-2', title: 'Test Post 2', date: '2023-01-02' }
  ];

  const mockCategories = ['Tech', 'Gaming'];
  const mockCategory = 'Tech';

  beforeEach(() => {
    getAllCategorySlugs.mockReturnValue(['tech', 'gaming']);
    getPostsByCategorySlug.mockReturnValue(mockPosts);
    getCategoryFromSlug.mockReturnValue(mockCategory);
  });

  test('getStaticPaths returns all category paths', async () => {
    const paths = await getStaticPaths();
    expect(paths).toEqual({
      paths: [
        { params: { category: 'tech' } },
        { params: { category: 'gaming' } }
      ],
      fallback: false
    });
    expect(getAllCategorySlugs).toHaveBeenCalled();
  });

  test('getStaticProps returns category data', async () => {
    const props = await getStaticProps({
      params: { category: 'tech' }
    });

    expect(props).toEqual({
      props: {
        posts: mockPosts,
        categories: mockCategories,
        currentCategory: mockCategory
      }
    });
    expect(getPostsByCategorySlug).toHaveBeenCalledWith('tech');
  });

  test('renders category page with posts', () => {
    render(
      <Category
        posts={mockPosts}
        categories={mockCategories}
        currentCategory={mockCategory}
      />
    );

    expect(screen.getByTestId('mock-layout')).toBeInTheDocument();
    mockPosts.forEach(post => {
      expect(screen.getByText(post.title)).toBeInTheDocument();
    });
  });

  test('handles empty posts array', () => {
    getPostsByCategorySlug.mockReturnValueOnce([]);
    render(
      <Category
        posts={[]}
        categories={mockCategories}
        currentCategory={mockCategory}
      />
    );

    expect(screen.getByText(/No posts found/i)).toBeInTheDocument();
  });

  test('displays category title', () => {
    render(
      <Category
        posts={mockPosts}
        categories={mockCategories}
        currentCategory={mockCategory}
      />
    );

    expect(screen.getByText(new RegExp(mockCategory, 'i'))).toBeInTheDocument();
  });

  test('sets page title correctly', () => {
    render(
      <Category
        posts={mockPosts}
        categories={mockCategories}
        currentCategory={mockCategory}
      />
    );

    const head = screen.getByTestId('mock-head');
    expect(head).toHaveTextContent(new RegExp(mockCategory, 'i'));
  });
});