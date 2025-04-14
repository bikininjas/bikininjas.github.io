import React from 'react';
import { render, screen } from '@testing-library/react';
import Layout from '../../components/layout';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

jest.mock('../../components/Navbar', () => {
  return function MockNavbar({ title }) {
    return <div data-testid="mock-navbar">{title}</div>;
  };
});

jest.mock('../../components/CategoryNav', () => {
  return function MockCategoryNav({ categories }) {
    return <div data-testid="mock-category-nav">{categories?.join(', ')}</div>;
  };
});

jest.mock('next/head', () => {
  return function MockHead({ children }) {
    return <div data-testid="mock-head">{children}</div>;
  };
});

describe('Layout Component', () => {
  const defaultProps = {
    children: <div>Test Content</div>,
    categories: ['Tech', 'Gaming']
  };

  beforeEach(() => {
    useRouter.mockReturnValue({ pathname: '/' });
  });

  test('renders children content', () => {
    render(<Layout {...defaultProps} />);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('renders navbar with correct title', () => {
    render(<Layout {...defaultProps} />);
    expect(screen.getByTestId('mock-navbar')).toHaveTextContent('BikiNinjas');
  });

  test('renders category navigation when provided', () => {
    render(<Layout {...defaultProps} />);
    expect(screen.getByTestId('mock-category-nav')).toHaveTextContent('Tech, Gaming');
  });

  test('sets custom page title when provided', () => {
    render(<Layout {...defaultProps} title="Custom Title" />);
    expect(screen.getByTestId('mock-head')).toHaveTextContent('Custom Title');
  });

  test('uses default page title when not provided', () => {
    render(<Layout {...defaultProps} />);
    expect(screen.getByTestId('mock-head')).toHaveTextContent('BikiNinjas Blog');
  });

  test('sets custom description when provided', () => {
    const description = 'Custom description';
    render(<Layout {...defaultProps} description={description} />);
    const meta = screen.getByTestId('mock-head');
    expect(meta).toHaveTextContent(description);
  });

  test('handles missing categories prop', () => {
    const { children } = defaultProps;
    render(<Layout>{children}</Layout>);
    expect(screen.getByTestId('mock-category-nav')).toBeInTheDocument();
  });

  test('applies dark mode class when enabled', () => {
    render(<Layout {...defaultProps} darkMode />);
    expect(screen.getByTestId('layout-container')).toHaveClass('dark');
  });

  test('handles different page routes', () => {
    useRouter.mockReturnValue({ pathname: '/posts/[id]' });
    render(<Layout {...defaultProps} />);
    expect(screen.getByTestId('layout-container')).toHaveClass('post-page');
  });

  test('renders footer content', () => {
    render(<Layout {...defaultProps} />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByText(/© 2023/)).toBeInTheDocument();
  });

  test('renders error boundary', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <Layout {...defaultProps}>
        <ThrowError />
      </Layout>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});
