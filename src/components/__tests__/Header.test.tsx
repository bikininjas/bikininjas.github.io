import * as React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../Header';
import { useRouter } from 'next/router';

describe('Header', () => {
  it('renders blog title and navigation links', () => {
    render(<Header />);
    expect(screen.getByText(/BikiNinjas Blog/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /categories/i })).toBeInTheDocument();
  });
});
