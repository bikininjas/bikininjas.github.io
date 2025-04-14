/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FirstPost from '../../pages/posts/first-post';
import { getAllCategories } from '../../lib/posts';

// Mock next/head
jest.mock('next/head', () => {
  return function MockHead({ children }) {
    return <div data-testid="mock-head">{children}</div>;
  };
});

jest.mock('../../lib/posts', () => ({
  getAllCategories: jest.fn()
}));

jest.mock('../../components/layout', () => {
  return function MockLayout({ children }) {
    return <div data-testid="mock-layout">{children}</div>;
  };
});

describe('First Post Page', () => {
  const mockCategories = ['Tech', 'Gaming', 'AI'];

  beforeEach(() => {
    getAllCategories.mockReturnValue(mockCategories);
  });

  test('renders first post page', () => {
    render(<FirstPost categories={mockCategories} />);
    
    expect(screen.getByTestId('mock-layout')).toBeInTheDocument();
    expect(screen.getByText('First Post')).toBeInTheDocument();
    expect(screen.getByText('Back to home')).toHaveAttribute('href', '/');
  });

  test('getStaticProps returns categories', async () => {
    const { props } = await FirstPost.getStaticProps();
    
    expect(props.categories).toEqual(mockCategories);
    expect(getAllCategories).toHaveBeenCalled();
  });

  test('throws error when categories prop is missing', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<FirstPost />)).toThrow();
    consoleSpy.mockRestore();
  });

  test('renders navigation elements', () => {
    render(<FirstPost categories={mockCategories} />);
    
    const homeLink = screen.getByText('Back to home');
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
