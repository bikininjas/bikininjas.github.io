import * as React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '../src/app/page';

describe('HomePage (extra)', () => {
  it('renders the Next.js logo image', () => {
    render(<HomePage />);
    const logo = screen.getByAltText('Next.js logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', expect.stringContaining('next.svg'));
  });

  it('renders the Vercel link', () => {
    render(<HomePage />);
    const link = screen.getByRole('link', { name: /vercel/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', expect.stringContaining('vercel.com'));
  });

  it('renders the Examples link', () => {
    render(<HomePage />);
    const link = screen.getByRole('link', { name: /examples/i });
    expect(link).toBeInTheDocument();
  });

  it('renders the Go to nextjs.org link', () => {
    render(<HomePage />);
    const link = screen.getByRole('link', { name: /go to nextjs.org/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', expect.stringContaining('nextjs.org'));
  });

  it('renders the code edit hint', () => {
    render(<HomePage />);
    expect(screen.getByText(/get started by editing/i)).toBeInTheDocument();
    expect(screen.getByText(/src\/app\/page\.tsx/i)).toBeInTheDocument();
  });
});
