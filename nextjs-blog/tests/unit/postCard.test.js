/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostCard from '../../components/PostCard';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }) => <a href={href}>{children}</a>;
});

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => <img {...props} />
}));

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
  const defaultProps = {
    post: {
      id: 'test-post',
      title: 'Test Post Title',
      date: '2023-01-01',
      excerpt: 'This is a test excerpt',
      category: 'Test Category',
      categorySlug: 'test-category',
      coverImage: '/images/test-cover.jpg'
    }
  };

  const defaultPost = {
    id: '1',
    title: 'Test Post',
    date: '2023-01-01',
    excerpt: 'Test description',
    categories: ['Tech', 'Gaming'],
    coverImage: '/test-image.jpg'
  };

  test('renders post details correctly', () => {
    render(<PostCard {...defaultProps} />);
    expect(screen.getByText(defaultProps.post.title)).toBeInTheDocument();
    expect(screen.getByText('January 1, 2023')).toBeInTheDocument();
    expect(screen.getByText(defaultProps.post.excerpt)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.post.category)).toBeInTheDocument();
  });

  test('renders cover image when provided', () => {
    render(<PostCard {...defaultProps} />);
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', defaultProps.post.coverImage);
    expect(image).toHaveAttribute('alt', defaultProps.post.title);
  });

  test('generates correct links', () => {
    render(<PostCard {...defaultProps} />);
    
    // Test post link
    const titleLink = screen.getByText(defaultProps.post.title).closest('a');
    expect(titleLink).toHaveAttribute('href', `/posts/${defaultProps.post.id}`);
    
    // Test category link
    const categoryLink = screen.getByText(defaultProps.post.category).closest('a');
    expect(categoryLink).toHaveAttribute('href', `/categories/${defaultProps.post.categorySlug}`);
  });

  test('handles missing cover image', () => {
    const propsWithoutImage = {
      post: { ...defaultProps.post }
    };
    delete propsWithoutImage.post.coverImage;
    
    render(<PostCard {...propsWithoutImage} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  test('truncates long excerpts', () => {
    const longExcerpt = 'a'.repeat(200);
    const propsWithLongExcerpt = {
      post: { ...defaultProps.post, excerpt: longExcerpt }
    };
    
    render(<PostCard {...propsWithLongExcerpt} />);
    const displayedExcerpt = screen.getByText(/a+/);
    expect(displayedExcerpt.textContent.length).toBeLessThan(longExcerpt.length);
    expect(displayedExcerpt.textContent).toMatch(/\.\.\.$/);
  });

  test('handles missing optional fields', () => {
    const minimalProps = {
      post: {
        id: 'test-post',
        title: 'Test Post Title'
      }
    };
    
    render(<PostCard {...minimalProps} />);
    expect(screen.getByText(minimalProps.post.title)).toBeInTheDocument();
    expect(screen.getByText('Invalid Date')).toBeInTheDocument();
    expect(screen.getByText('Uncategorized')).toBeInTheDocument();
  });

  test('applies hover effects', () => {
    render(<PostCard {...defaultProps} />);
    const card = screen.getByTestId('post-card');
    expect(card).toHaveClass('hover:shadow-lg');
  });

  test('renders post card with all elements', () => {
    render(<PostCard post={defaultPost} />);
    
    expect(screen.getByRole('article')).toBeInTheDocument();
    expect(screen.getByText(defaultPost.title)).toBeInTheDocument();
    expect(screen.getByText('January 1, 2023')).toBeInTheDocument();
    expect(screen.getByText(defaultPost.excerpt)).toBeInTheDocument();
  });

  test('sets correct ARIA attributes', () => {
    render(<PostCard post={defaultPost} />);
    
    const link = screen.getByRole('link');
    const date = screen.getByText('January 1, 2023');
    const category = screen.getByText('Tech');
    
    expect(link).toHaveAttribute('aria-label', `Read more about ${defaultPost.title}`);
    expect(date).toHaveAttribute('aria-label', 'Published on January 1, 2023');
    expect(category).toHaveAttribute('aria-label', 'Category: Tech');
  });

  test('handles image loading error', () => {
    render(<PostCard post={defaultPost} />);
    const image = screen.getByRole('img');
    
    fireEvent.error(image);
    
    expect(image.src).toContain('unsplash.com');
  });

  test('applies hover state correctly', () => {
    render(<PostCard post={defaultPost} />);
    const article = screen.getByRole('article');
    
    fireEvent.mouseEnter(article);
    expect(article).toHaveClass('hovered');
    
    fireEvent.mouseLeave(article);
    expect(article).not.toHaveClass('hovered');
  });

  test('uses category-specific image when no cover image', () => {
    const postWithoutCover = {
      ...defaultPost,
      coverImage: undefined
    };
    
    render(<PostCard post={postWithoutCover} />);
    const image = screen.getByRole('img');
    expect(image.src).toContain('unsplash.com');
  });

  test('handles missing categories gracefully', () => {
    const postWithoutCategories = {
      ...defaultPost,
      categories: undefined
    };
    
    render(<PostCard post={postWithoutCategories} />);
    expect(screen.queryByText('•')).not.toBeInTheDocument();
  });

  test('limits category display to two', () => {
    const postWithManyCategories = {
      ...defaultPost,
      categories: ['Tech', 'Gaming', 'Development']
    };
    
    render(<PostCard post={postWithManyCategories} />);
    const categories = screen.getAllByTestId('category');
    expect(categories).toHaveLength(2);
  });

  test('renders within error boundary', () => {
    const ErrorComponent = () => {
      throw new Error('Test error');
    };

    render(
      <PostCard post={defaultPost}>
        <ErrorComponent />
      </PostCard>
    );

    expect(screen.getByRole('article')).toBeInTheDocument();
  });

  test('hides decorative elements from screen readers', () => {
    render(<PostCard post={defaultPost} />);
    
    const separator = screen.getByText('•');
    const readMore = screen.getByText('Read more →');
    
    expect(separator).toHaveAttribute('aria-hidden', 'true');
    expect(readMore).toHaveAttribute('aria-hidden', 'true');
  });

  test('provides focus styles for keyboard navigation', () => {
    render(<PostCard post={defaultPost} />);
    const link = screen.getByRole('link');
    
    fireEvent.focus(link);
    expect(link).toHaveClass('focus-visible');
    
    fireEvent.blur(link);
    expect(link).not.toHaveClass('focus-visible');
  });
});
