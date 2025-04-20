import * as React from 'react';
import { render, screen } from '@testing-library/react';
import ArticleCard from '../ArticleCard';

const props = {
  slug: 'test-post',
  title: 'Test Title',
  date: '2025-04-20',
  excerpt: 'This is a test excerpt.',
  category: 'Testing',
};

describe('ArticleCard', () => {
  it('renders the title, date, excerpt, and category', () => {
    render(<ArticleCard {...props} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText(/2025-04-20/)).toBeInTheDocument();
    expect(screen.getByText('This is a test excerpt.')).toBeInTheDocument();
    expect(screen.getAllByText('Testing')[0]).toBeInTheDocument();
  });

  it('links to the correct post and category', () => {
    render(<ArticleCard {...props} />);
    const postLink = screen.getByRole('link', { name: /test title/i });
    expect(postLink).toHaveAttribute('href', '/test-post');
    const categoryLink = screen.getByRole('link', { name: /testing/i });
    expect(categoryLink).toHaveAttribute('href', '/category/Testing');
  });
});
