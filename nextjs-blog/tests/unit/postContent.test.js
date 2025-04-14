import React from 'react';
import { render, screen } from '@testing-library/react';
import PostContent from '../../components/PostContent';

jest.mock('next/link', () => {
  return ({ children, href }) => <a href={href}>{children}</a>;
});

describe('PostContent Component', () => {
  const mockPost = {
    title: 'Test Post Title',
    date: '2023-01-01',
    contentHtml: '<p>Test content</p>',
    category: 'Test Category',
    categorySlug: 'test-category',
    readTime: '5 min read'
  };

  test('renders post content correctly', () => {
    render(<PostContent post={mockPost} />);
    
    expect(screen.getByText(mockPost.title)).toBeInTheDocument();
    expect(screen.getByText(mockPost.date)).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
    expect(screen.getByText(mockPost.category)).toBeInTheDocument();
    expect(screen.getByText(mockPost.readTime)).toBeInTheDocument();
  });

  test('renders HTML content safely', () => {
    const postWithScript = {
      ...mockPost,
      contentHtml: '<p>Safe content</p><script>alert("unsafe")</script>'
    };
    
    render(<PostContent post={postWithScript} />);
    
    expect(screen.getByText('Safe content')).toBeInTheDocument();
    expect(document.querySelector('script')).toBeNull();
  });

  test('renders category link correctly', () => {
    render(<PostContent post={mockPost} />);
    
    const categoryLink = screen.getByText(mockPost.category).closest('a');
    expect(categoryLink).toHaveAttribute('href', `/categories/${mockPost.categorySlug}`);
  });

  test('handles missing optional fields', () => {
    const minimalPost = {
      title: 'Test Post',
      contentHtml: '<p>Content</p>'
    };
    
    render(<PostContent post={minimalPost} />);
    
    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  test('throws error when post prop is missing', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<PostContent />)).toThrow();
    consoleSpy.mockRestore();
  });

  test('handles empty content', () => {
    const postWithoutContent = {
      ...mockPost,
      contentHtml: ''
    };
    
    render(<PostContent post={postWithoutContent} />);
    expect(screen.getByRole('article')).toBeEmptyDOMElement();
  });

  test('renders nested HTML elements correctly', () => {
    const postWithNestedHtml = {
      ...mockPost,
      contentHtml: '<div><h2>Section</h2><p>Nested content</p></div>'
    };
    
    render(<PostContent post={postWithNestedHtml} />);
    expect(screen.getByText('Section')).toBeInTheDocument();
    expect(screen.getByText('Nested content')).toBeInTheDocument();
  });
});
