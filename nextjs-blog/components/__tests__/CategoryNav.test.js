import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CategoryNav from '../CategoryNav';
import { useRouter } from 'next/router';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

describe('CategoryNav', () => {
  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      pathname: '/',
      query: {},
      push: jest.fn()
    }));
  });

  it('renders the category navigation', () => {
    const categories = ['Technology', 'Travel', 'Food'];
    render(<CategoryNav categories={categories} />);
    
    categories.forEach(category => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  it('handles category selection correctly', () => {
    const categories = ['Technology', 'Travel', 'Food'];
    const mockPush = jest.fn();
    useRouter.mockImplementation(() => ({
      pathname: '/',
      query: {},
      push: mockPush
    }));

    render(<CategoryNav categories={categories} />);
    
    fireEvent.click(screen.getByText('Technology'));
    expect(mockPush).toHaveBeenCalled();
  });
  
  it('shows active category as selected', () => {
    const categories = ['Technology', 'Travel', 'Food'];
    useRouter.mockImplementation(() => ({
      pathname: '/categories/Technology',
      query: { category: 'Technology' },
      push: jest.fn()
    }));

    render(<CategoryNav categories={categories} />);
    
    const activeLink = screen.getByText('Technology');
    expect(activeLink).toHaveAttribute('aria-current', 'page');
  });
});
