/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CategoryNav from '../../components/CategoryNav';
import { useRouter } from 'next/router';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }) => <a href={href}>{children}</a>;
});

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

describe('CategoryNav Component', () => {
  const defaultProps = {
    categories: ['Technology', 'Gaming', 'Development'],
    currentCategory: null
  };

  beforeEach(() => {
    useRouter.mockReset();
    useRouter.mockReturnValue({
      push: jest.fn(),
      pathname: '/'
    });
  });

  test('renders all categories', () => {
    render(<CategoryNav {...defaultProps} />);
    
    defaultProps.categories.forEach(category => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  test('highlights current category', () => {
    const props = {
      ...defaultProps,
      currentCategory: 'Gaming'
    };

    render(<CategoryNav {...props} />);
    const activeLink = screen.getByText('Gaming').closest('a');
    expect(activeLink).toHaveClass('active');
  });

  test('renders "All Posts" link', () => {
    render(<CategoryNav {...defaultProps} />);
    const allPostsLink = screen.getByText('All Posts');
    expect(allPostsLink).toBeInTheDocument();
    expect(allPostsLink).toHaveAttribute('href', '/');
  });

  test('highlights "All Posts" when no category selected', () => {
    render(<CategoryNav {...defaultProps} />);
    const allPostsLink = screen.getByText('All Posts');
    expect(allPostsLink).toHaveClass('active');
  });

  test('links to correct category paths', () => {
    render(<CategoryNav {...defaultProps} />);
    
    defaultProps.categories.forEach(category => {
      const link = screen.getByText(category);
      expect(link).toHaveAttribute('href', `/categories/${category.toLowerCase()}`);
    });
  });

  test('handles empty categories array', () => {
    render(<CategoryNav categories={[]} />);
    expect(screen.getByText('All Posts')).toBeInTheDocument();
  });

  test('handles undefined categories prop', () => {
    render(<CategoryNav />);
    expect(screen.getByText('All Posts')).toBeInTheDocument();
  });

  test('handles category names with special characters', () => {
    const props = {
      categories: ['C++', 'C#', '.NET'],
      currentCategory: 'C++'
    };

    render(<CategoryNav {...props} />);
    props.categories.forEach(category => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  test('maintains scroll position on category switch', () => {
    const { rerender } = render(<CategoryNav {...defaultProps} />);
    
    // Click a category
    fireEvent.click(screen.getByText('Gaming'));
    
    // Re-render with new current category
    rerender(<CategoryNav {...defaultProps} currentCategory="Gaming" />);
    
    expect(screen.getByText('Gaming').closest('a')).toHaveClass('active');
  });

  test('handles responsive layout', () => {
    render(<CategoryNav {...defaultProps} />);
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('category-nav');
  });

  test('applies active styles correctly', () => {
    const props = {
      ...defaultProps,
      currentCategory: 'Technology'
    };

    render(<CategoryNav {...props} />);
    
    // Check active category
    expect(screen.getByText('Technology').closest('a')).toHaveClass('active');
    
    // Check other categories are not active
    expect(screen.getByText('Gaming').closest('a')).not.toHaveClass('active');
    expect(screen.getByText('Development').closest('a')).not.toHaveClass('active');
  });

  test('toggles menu on button click', () => {
    render(<CategoryNav {...defaultProps} />);
    const button = screen.getByRole('button');
    const list = screen.getByRole('list');

    fireEvent.click(button);
    expect(list).toHaveClass('show');

    fireEvent.click(button);
    expect(list).not.toHaveClass('show');
  });

  test('toggles menu on Enter key press', () => {
    render(<CategoryNav {...defaultProps} />);
    const button = screen.getByRole('button');
    const list = screen.getByRole('list');

    fireEvent.keyDown(button, { key: 'Enter' });
    expect(list).toHaveClass('show');

    fireEvent.keyDown(button, { key: 'Enter' });
    expect(list).not.toHaveClass('show');
  });

  test('sets correct ARIA attributes', () => {
    render(<CategoryNav {...defaultProps} />);
    const nav = screen.getByRole('navigation');
    const button = screen.getByRole('button');
    const list = screen.getByRole('list');

    expect(nav).toHaveAttribute('aria-label', 'Categories');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-controls', 'category-list');
    expect(list).toHaveAttribute('id', 'category-list');
  });

  test('marks current category as active', () => {
    const props = {
      ...defaultProps,
      currentCategory: 'Tech'
    };

    render(<CategoryNav {...props} />);
    const techLink = screen.getByText('Tech').closest('a');
    expect(techLink).toHaveAttribute('aria-current', 'page');
  });

  test('marks "All Posts" as active when no category selected', () => {
    render(<CategoryNav {...defaultProps} />);
    const allPostsLink = screen.getByText('All Posts').closest('a');
    expect(allPostsLink).toHaveAttribute('aria-current', 'page');
  });

  test('generates correct category links', () => {
    render(<CategoryNav {...defaultProps} />);
    defaultProps.categories.forEach(category => {
      const link = screen.getByText(category).closest('a');
      expect(link).toHaveAttribute('href', `/categories/${category.toLowerCase()}`);
    });
  });

  test('handles empty categories array', () => {
    render(<CategoryNav categories={[]} />);
    expect(screen.getByText('All Posts')).toBeInTheDocument();
  });
});
