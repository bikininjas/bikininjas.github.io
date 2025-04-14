import React from 'react';
import { render, screen } from '@testing-library/react';
import CategoryPage from '../[category]';
import { getPostsByCategory, getCategoriesWithCount } from '../../../lib/posts';
import { useRouter } from 'next/router';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

// Mock the posts library
jest.mock('../../../lib/posts', () => ({
  getPostsByCategory: jest.fn(),
  getCategoriesWithCount: jest.fn()
}));

// Mock components
jest.mock('../../../components/PostCard', () => ({ post }) => (
  <div data-testid="post-card">{post.title}</div>
));
jest.mock('../../../components/CategoryNav', () => ({ categories }) => (
  <div data-testid="category-nav">
    {Object.keys(categories).map(cat => <span key={cat}>{cat}</span>)}
  </div>
));
jest.mock('../../../components/SEO', () => ({ title }) => (
  <title data-testid="seo">{title}</title>
));
jest.mock('../../../components/PostParallax', () => ({ title }) => (
  <div data-testid="post-parallax">{title}</div>
));

describe('Category page', () => {
  beforeEach(() => {
    // Setup router mock
    useRouter.mockImplementation(() => ({
      query: { category: 'Tech' },
      isReady: true
    }));

    // Mock the returned posts data
    getPostsByCategory.mockReturnValue([
      {
        id: 'tech-post-1',
        title: 'Tech Post 1',
        date: '2023-01-01',
        category: 'Tech',
        excerpt: 'This is tech post 1'
      },
      {
        id: 'tech-post-2',
        title: 'Tech Post 2',
        date: '2023-01-02',
        category: 'Tech',
        excerpt: 'This is tech post 2'
      }
    ]);

    // Mock categories data
    getCategoriesWithCount.mockReturnValue({
      Tech: 2,
      Travel: 1
    });
  });

  it('renders the category title', () => {
    render(<CategoryPage />);
    expect(screen.getByTestId('post-parallax')).toHaveTextContent('Tech');
  });

  it('renders posts for the selected category', () => {
    render(<CategoryPage />);
    const postCards = screen.getAllByTestId('post-card');
    expect(postCards).toHaveLength(2);
    expect(postCards[0]).toHaveTextContent('Tech Post 1');
    expect(postCards[1]).toHaveTextContent('Tech Post 2');
  });

  it('renders the category navigation with all categories', () => {
    render(<CategoryPage />);
    expect(screen.getByTestId('category-nav')).toBeInTheDocument();
    expect(screen.getByText('Tech')).toBeInTheDocument();
    expect(screen.getByText('Travel')).toBeInTheDocument();
  });

  it('renders SEO component with correct title', () => {
    render(<CategoryPage />);
    expect(screen.getByTestId('seo')).toHaveTextContent(/Tech/i);
  });

  it('handles empty category results', () => {
    getPostsByCategory.mockReturnValueOnce([]);
    render(<CategoryPage />);
    
    // Should still render the category title and navigation
    expect(screen.getByTestId('post-parallax')).toHaveTextContent('Tech');
    expect(screen.getByTestId('category-nav')).toBeInTheDocument();
    
    // But no post cards
    expect(screen.queryAllByTestId('post-card')).toHaveLength(0);
  });
});
