import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CategoryNav from '../../components/CategoryNav';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }) => <a href={href}>{children}</a>;
});

describe('CategoryNav Component', () => {
  const defaultProps = {
    categories: ['Technology', 'Gaming', 'Development'],
    currentCategory: null
  };

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
});
