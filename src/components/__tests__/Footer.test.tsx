import * as React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer', () => {
  it('renders copyright and tech stack', () => {
    render(<Footer />);
    expect(screen.getByText(/BikiNinjas Blog/i)).toBeInTheDocument();
    expect(screen.getByText(/Powered by Next.js/i)).toBeInTheDocument();
  });
});
