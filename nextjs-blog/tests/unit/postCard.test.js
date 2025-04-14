import React from 'react';
import { render, screen } from '@testing-library/react';
import PostCard from '../../components/PostCard';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }) => <a href={href}>{children}</a>;
});

// Mock CSS modules
jest.mock('../styles/Card.module.css', () => ({
  cardLink: 'cardLink',
  card: 'card',
  cardWithBg: 'cardWithBg',
  cardContent: 'cardContent',
  cardCategories: 'cardCategories',
  cardCategory: 'cardCategory',
  cardTitle: 'cardTitle',
  cardDate: 'cardDate',
  cardExcerpt: 'cardExcerpt',
  cardArrow: 'cardArrow'
}), { virtual: true });

describe('PostCard Component', () => {
  const mockPost = {
    id: 'test-post',
    title: 'Test Post',
    date: '2023-01-01',
    excerpt: 'This is a test excerpt',
    category: 'Test Category',
    categorySlug: 'test-category',
    coverImage: '/images/test-cover.jpg'
  };

  test('renders post details correctly', () => {
    render(<PostCard post={mockPost} />);
    
    expect(screen.getByText(mockPost.title)).toBeInTheDocument();
    expect(screen.getByText(mockPost.date)).toBeInTheDocument();
    expect(screen.getByText(mockPost.excerpt)).toBeInTheDocument();
    expect(screen.getByText(mockPost.category)).toBeInTheDocument();
  });

  test('generates correct links', () => {
    render(<PostCard post={mockPost} />);
    
    const titleLink = screen.getByText(mockPost.title).closest('a');
    expect(titleLink).toHaveAttribute('href', `/posts/${mockPost.id}`);
    
    const categoryLink = screen.getByText(mockPost.category).closest('a');
    expect(categoryLink).toHaveAttribute('href', `/categories/${mockPost.categorySlug}`);
  });

  test('renders cover image when provided', () => {
    render(<PostCard post={mockPost} />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', mockPost.coverImage);
    expect(image).toHaveAttribute('alt', mockPost.title);
  });

  test('renders without cover image', () => {
    const postWithoutImage = { ...mockPost };
    delete postWithoutImage.coverImage;
    
    render(<PostCard post={postWithoutImage} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  test('truncates long excerpts', () => {
    const longExcerpt = 'a'.repeat(200);
    const postWithLongExcerpt = { ...mockPost, excerpt: longExcerpt };
    
    render(<PostCard post={postWithLongExcerpt} />);
    const displayedExcerpt = screen.getByText(/a+/);
    expect(displayedExcerpt.textContent.length).toBeLessThan(longExcerpt.length);
    expect(displayedExcerpt.textContent).toMatch(/\.\.\.$/);
  });

  test('formats date correctly', () => {
    render(<PostCard post={mockPost} />);
    const dateElement = screen.getByText(mockPost.date);
    expect(dateElement).toBeInTheDocument();
    expect(dateElement.tagName).toBe('TIME');
  });

  test('handles missing optional fields', () => {
    const minimalPost = {
      id: 'test-post',
      title: 'Test Post'
    };
    
    render(<PostCard post={minimalPost} />);
    expect(screen.getByText(minimalPost.title)).toBeInTheDocument();
  });

  test('applies hover effects', () => {
    render(<PostCard post={mockPost} />);
    const card = screen.getByTestId('post-card');
    expect(card).toHaveClass('hover:shadow-lg');
  });

  test('throws error when post prop is missing', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<PostCard />)).toThrow();
    consoleSpy.mockRestore();
  });
});
