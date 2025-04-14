import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../index';
import { getSortedPostsData } from '../../lib/posts';

// Mock the posts library
jest.mock('../../lib/posts', () => ({
  getSortedPostsData: jest.fn()
}));

// Mock components used in the Home page
jest.mock('../../components/ParallaxHero', () => () => (
  <div data-testid="parallax-hero">Parallax Hero</div>
));
jest.mock('../../components/PostCard', () => ({ post }) => (
  <div data-testid="post-card">{post.title}</div>
));
jest.mock('../../components/CategoryNav', () => ({ categories }) => (
  <div data-testid="category-nav">
    {categories.map(cat => <span key={cat}>{cat}</span>)}
  </div>
));
jest.mock('../../components/SEO', () => ({ title }) => (
  <title data-testid="seo">{title}</title>
));

describe('Home page', () => {
  beforeEach(() => {
    // Mock the returned posts data
    getSortedPostsData.mockReturnValue([
      {
        id: 'test-post-1',
        title: 'Test Post 1',
        date: '2023-01-01',
        category: 'Tech',
        excerpt: 'This is test post 1'
      },
      {
        id: 'test-post-2',
        title: 'Test Post 2',
        date: '2023-01-02',
        category: 'Travel',
        excerpt: 'This is test post 2'
      }
    ]);
  });

  it('renders the hero component', () => {
    render(<Home />);
    expect(screen.getByTestId('parallax-hero')).toBeInTheDocument();
  });

  it('renders post cards for each post', () => {
    render(<Home />);
    const postCards = screen.getAllByTestId('post-card');
    expect(postCards).toHaveLength(2);
    expect(postCards[0]).toHaveTextContent('Test Post 1');
    expect(postCards[1]).toHaveTextContent('Test Post 2');
  });

  it('renders the category navigation', () => {
    render(<Home />);
    expect(screen.getByTestId('category-nav')).toBeInTheDocument();
    expect(screen.getByText('Tech')).toBeInTheDocument();
    expect(screen.getByText('Travel')).toBeInTheDocument();
  });

  it('renders SEO component with correct title', () => {
    render(<Home />);
    expect(screen.getByTestId('seo')).toHaveTextContent(/home/i);
  });

  it('passes correct props to components', () => {
    render(<Home />);
    
    // Check that CategoryNav receives correct categories
    const categoryNav = screen.getByTestId('category-nav');
    expect(categoryNav).toHaveTextContent('Tech');
    expect(categoryNav).toHaveTextContent('Travel');
    
    // Check PostCard content
    const postCards = screen.getAllByTestId('post-card');
    expect(postCards[0]).toHaveTextContent('Test Post 1');
    expect(postCards[1]).toHaveTextContent('Test Post 2');
  });
});
