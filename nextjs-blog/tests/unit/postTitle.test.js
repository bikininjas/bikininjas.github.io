import React from 'react';
import { render, screen } from '@testing-library/react';
import PostTitle from '../../components/PostTitle';

describe('PostTitle Component', () => {
  const defaultProps = {
    title: 'Test Post Title',
    category: 'Technology',
    date: '2023-01-01',
    author: 'John Doe'
  };

  test('renders title correctly', () => {
    render(<PostTitle {...defaultProps} />);
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
  });

  test('renders category link', () => {
    render(<PostTitle {...defaultProps} />);
    const categoryLink = screen.getByText(defaultProps.category);
    expect(categoryLink).toBeInTheDocument();
    expect(categoryLink).toHaveAttribute('href', `/categories/${defaultProps.category.toLowerCase()}`);
  });

  test('formats date correctly', () => {
    render(<PostTitle {...defaultProps} />);
    expect(screen.getByText(/January 1, 2023/)).toBeInTheDocument();
  });

  test('displays author name', () => {
    render(<PostTitle {...defaultProps} />);
    expect(screen.getByText(defaultProps.author)).toBeInTheDocument();
  });

  test('handles missing category', () => {
    const { category, ...propsWithoutCategory } = defaultProps;
    render(<PostTitle {...propsWithoutCategory} />);
    expect(screen.queryByText('Technology')).not.toBeInTheDocument();
  });

  test('handles missing date', () => {
    const { date, ...propsWithoutDate } = defaultProps;
    render(<PostTitle {...propsWithoutDate} />);
    expect(screen.queryByText(/January 1, 2023/)).not.toBeInTheDocument();
  });

  test('handles missing author', () => {
    const { author, ...propsWithoutAuthor } = defaultProps;
    render(<PostTitle {...propsWithoutAuthor} />);
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  test('handles long titles', () => {
    const longTitle = 'A'.repeat(100);
    render(<PostTitle {...defaultProps} title={longTitle} />);
    expect(screen.getByText(longTitle)).toBeInTheDocument();
  });

  test('handles special characters in title', () => {
    const titleWithSpecialChars = 'Test & Title: With "Special" Characters';
    render(<PostTitle {...defaultProps} title={titleWithSpecialChars} />);
    expect(screen.getByText(titleWithSpecialChars)).toBeInTheDocument();
  });

  test('handles special characters in category', () => {
    const categoryWithSpecialChars = 'C++ & .NET';
    render(<PostTitle {...defaultProps} category={categoryWithSpecialChars} />);
    expect(screen.getByText(categoryWithSpecialChars)).toBeInTheDocument();
  });

  test('maintains metadata order', () => {
    render(<PostTitle {...defaultProps} />);
    const metadataContainer = screen.getByTestId('post-metadata');
    const metadata = metadataContainer.textContent;
    
    // Check if metadata appears in the correct order
    const categoryIndex = metadata.indexOf(defaultProps.category);
    const dateIndex = metadata.indexOf('January 1, 2023');
    const authorIndex = metadata.indexOf(defaultProps.author);
    
    expect(categoryIndex).toBeLessThan(dateIndex);
    expect(dateIndex).toBeLessThan(authorIndex);
  });
});