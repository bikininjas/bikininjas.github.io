import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ImagePreview from '../ImagePreview';

describe('ImagePreview', () => {
  const mockProps = {
    src: '/images/test-image.jpg',
    alt: 'Test image',
    width: 800,
    height: 600
  };

  it('renders the image with correct attributes', () => {
    render(<ImagePreview {...mockProps} />);
    
    const image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', expect.stringContaining('test-image.jpg'));
  });

  it('opens modal when image is clicked', () => {
    render(<ImagePreview {...mockProps} />);
    
    const image = screen.getByAltText('Test image');
    fireEvent.click(image);
    
    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveClass('open');
  });

  it('closes modal when close button is clicked', () => {
    render(<ImagePreview {...mockProps} />);
    
    // Open modal first
    const image = screen.getByAltText('Test image');
    fireEvent.click(image);
    
    // Click close button
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    // Check that modal is closed or removed
    const modal = screen.queryByRole('dialog');
    expect(modal).not.toHaveClass('open');
  });

  it('applies lazy loading by default', () => {
    render(<ImagePreview {...mockProps} />);
    
    const image = screen.getByAltText('Test image');
    expect(image).toHaveAttribute('loading', 'lazy');
  });
});
