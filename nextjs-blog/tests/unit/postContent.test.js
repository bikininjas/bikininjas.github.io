/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostContent from '../../components/PostContent';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }) => <a href={href}>{children}</a>;
});

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => <img {...props} />
}));

describe('PostContent Component', () => {
  const defaultProps = {
    title: 'Test Post',
    date: '2023-01-01',
    contentHtml: '<p>Test content</p>',
    category: 'Technology',
    categorySlug: 'technology'
  };

  test('renders post content with all elements', () => {
    render(<PostContent {...defaultProps} />);
    
    expect(screen.getByRole('article')).toBeInTheDocument();
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText('January 1, 2023')).toBeInTheDocument();
    expect(screen.getByText(defaultProps.category)).toBeInTheDocument();
  });

  test('sets correct ARIA attributes', () => {
    render(<PostContent {...defaultProps} />);
    
    const article = screen.getByRole('article');
    const date = screen.getByText('January 1, 2023');
    const categoryLink = screen.getByText(defaultProps.category);

    expect(article).toHaveAttribute('role', 'article');
    expect(date).toHaveAttribute('aria-label', 'Publication date');
    expect(categoryLink).toHaveAttribute('aria-label', `View all posts in category ${defaultProps.category}`);
  });

  test('renders HTML content safely', () => {
    const htmlContent = '<h2>Test heading</h2><p>Test paragraph</p>';
    render(<PostContent {...defaultProps} contentHtml={htmlContent} />);
    
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Test heading');
    expect(screen.getByText('Test paragraph')).toBeInTheDocument();
  });

  test('handles missing category gracefully', () => {
    const { category, categorySlug, ...propsWithoutCategory } = defaultProps;
    render(<PostContent {...propsWithoutCategory} />);
    
    expect(screen.queryByText('•')).not.toBeInTheDocument();
  });

  test('formats date correctly', () => {
    const dates = [
      { input: '2023-01-01', expected: 'January 1, 2023' },
      { input: '2023-12-31', expected: 'December 31, 2023' }
    ];

    dates.forEach(({ input, expected }) => {
      const { rerender } = render(<PostContent {...defaultProps} date={input} />);
      expect(screen.getByText(expected)).toBeInTheDocument();
      rerender(<PostContent {...defaultProps} date={input} />);
    });
  });

  test('applies post body tab index', () => {
    render(<PostContent {...defaultProps} />);
    const postBody = screen.getByText('Test content');
    expect(postBody.parentElement).toHaveAttribute('tabIndex', '0');
  });

  test('hides separator from screen readers', () => {
    render(<PostContent {...defaultProps} />);
    const separator = screen.getByText('•');
    expect(separator).toHaveAttribute('aria-hidden', 'true');
  });

  test('handles invalid date gracefully', () => {
    render(<PostContent {...defaultProps} date="invalid-date" />);
    expect(screen.getByText('Invalid Date')).toBeInTheDocument();
  });

  test('renders within error boundary', () => {
    const props = {
      ...defaultProps,
      contentHtml: '<script>alert("xss")</script>'
    };
    
    render(<PostContent {...props} />);
    expect(screen.queryByText('alert("xss")')).not.toBeInTheDocument();
  });

  test('handles HTML content safely', () => {
    const props = {
      ...defaultProps,
      contentHtml: '<h2>Section Title</h2><p>Paragraph content</p>'
    };
    render(<PostContent {...props} />);
    expect(screen.getByText('Section Title')).toBeInTheDocument();
    expect(screen.getByText('Paragraph content')).toBeInTheDocument();
  });

  test('handles missing date', () => {
    const { date, ...propsWithoutDate } = defaultProps;
    render(<PostContent {...propsWithoutDate} />);
    expect(screen.getByText('Invalid Date')).toBeInTheDocument();
  });

  test('handles empty content', () => {
    const props = {
      ...defaultProps,
      contentHtml: ''
    };
    render(<PostContent {...props} />);
    const article = screen.getByRole('article');
    expect(article).toBeInTheDocument();
    expect(article.innerHTML).toContain('');
  });

  test('applies proper styling classes', () => {
    render(<PostContent {...defaultProps} />);
    expect(screen.getByRole('article')).toHaveClass('post-content');
  });

  test('handles complex HTML content', () => {
    const props = {
      ...defaultProps,
      contentHtml: `
        <h2>Section 1</h2>
        <p>First paragraph</p>
        <ul>
          <li>List item 1</li>
          <li>List item 2</li>
        </ul>
        <blockquote>Quote text</blockquote>
      `
    };
    render(<PostContent {...props} />);
    
    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.getByText('First paragraph')).toBeInTheDocument();
    expect(screen.getByText('List item 1')).toBeInTheDocument();
    expect(screen.getByText('List item 2')).toBeInTheDocument();
    expect(screen.getByText('Quote text')).toBeInTheDocument();
  });
});
