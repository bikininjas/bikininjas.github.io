import React from 'react';
import { render, screen, within } from '@testing-library/react';
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
// Update the CategoryNav mock to handle an array of objects
jest.mock('../../../components/CategoryNav', () => ({ categories }) => (
  <div data-testid="category-nav">
    {/* Ensure categories is an array before mapping */}
    {Array.isArray(categories) && categories.map(cat => <span key={cat.slug}>{cat.name}</span>)}
  </div>
));
jest.mock('../../../components/SEO', () => ({ title }) => (
  <title data-testid="seo">{title}</title>
));
jest.mock('../../../components/PostParallax', () => ({ title }) => (
  <div data-testid="post-parallax">{title}</div>
));

describe('Category page', () => {
  const mockCategorySlug = 'tech';
  const mockCategoryName = 'Technology'; // Assuming you can derive this or pass it
  const mockPosts = [
    { id: 'post1', title: 'Tech Post 1', date: '2023-01-01', excerpt: 'Excerpt 1', categories: ['Tech'] },
    { id: 'post3', title: 'Tech Post 2', date: '2023-01-03', excerpt: 'Excerpt 3', categories: ['Tech', 'AI'] },
  ];
  const mockAllCategories = [
    { name: 'Tech', slug: 'tech' },
    { name: 'Gaming', slug: 'gaming' },
  ];

  // Props that would be passed by getStaticProps
  const defaultProps = {
    posts: mockPosts,
    category: mockCategorySlug, // The slug
    categoryName: mockCategoryName, // The display name
    categories: mockAllCategories,
  };

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
    render(<CategoryPage {...defaultProps} />);
    expect(screen.getByTestId('post-parallax')).toHaveTextContent('Tech');
  });

  it('renders posts for the selected category', () => {
    render(<CategoryPage {...defaultProps} />);
    const postCards = screen.getAllByTestId('post-card');
    expect(postCards).toHaveLength(2);
    expect(postCards[0]).toHaveTextContent('Tech Post 1');
    expect(postCards[1]).toHaveTextContent('Tech Post 2');
  });

  it('renders the category navigation with all categories', () => {
    render(<CategoryPage {...defaultProps} />);
    
    // Find all elements with the data-testid
    const categoryNavs = screen.getAllByTestId('category-nav'); 
    // Assume the second element is the one containing the links based on the structure in the report
    const actualCategoryNav = categoryNavs[1]; 
    
    expect(actualCategoryNav).toBeInTheDocument();
    // Check for category names *within* the correct nav component found
    expect(within(actualCategoryNav).getByText('Tech')).toBeInTheDocument(); 
    expect(within(actualCategoryNav).getByText('Gaming')).toBeInTheDocument(); 
  });

  it('renders SEO component with correct title', () => {
    render(<CategoryPage {...defaultProps} />);
    expect(screen.getByTestId('seo')).toHaveTextContent(/Tech/i);
  });

  it('handles empty category results', () => {
    getPostsByCategory.mockReturnValueOnce([]);
    render(<CategoryPage {...defaultProps} posts={[]} />);
    
    // Should still render the category title and navigation
    expect(screen.getByTestId('post-parallax')).toHaveTextContent('Tech');
    
    // Find all elements with the data-testid
    const categoryNavs = screen.getAllByTestId('category-nav'); 
    // Assume the second element is the one we want to check
    const actualCategoryNav = categoryNavs[1]; 
    expect(actualCategoryNav).toBeInTheDocument();
    
    // But no post cards
    expect(screen.queryAllByTestId('post-card')).toHaveLength(0);
  });
});
