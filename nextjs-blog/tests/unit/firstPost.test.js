import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FirstPost from '../../pages/posts/first-post';

describe('FirstPost Component', () => {
  it('renders the first post heading', () => {
    render(<FirstPost />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('First Post');
  });
});
