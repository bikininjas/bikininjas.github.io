import React from 'react';
import { render, screen } from '@testing-library/react';
import PostCard from '../PostCard';

// Mock Next.js Link component
jest.mock('next/link', () => ({ children }) => children);

describe('PostCard', () => {
  const mockPost = {
    id: 'test-post',
    title: 'Test Post Title',
    date: '2023-01-01',
    excerpt: 'This is a test excerpt',
    coverImage: '/images/test-image.jpg',
    category: 'Technology'
  };

  it('renders post title and excerpt', () => {
    render(<PostCard post={mockPost} />);
    
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    expect(screen.getByText('This is a test excerpt')).toBeInTheDocument();
  });

  it('renders post date in formatted style', () => {
    render(<PostCard post={mockPost} />);
    
    // Assuming the component formats the date
    expect(screen.getByText(/2023/)).toBeInTheDocument();
  });

  it('renders post category', () => {
    render(<PostCard post={mockPost} />);
    
    expect(screen.getByText('Technology')).toBeInTheDocument();
  });

  it('displays post cover image', () => {
    render(<PostCard post={mockPost} />);
    
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', expect.stringContaining('test-image.jpg'));
  });
});
