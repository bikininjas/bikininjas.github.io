/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from '@testing-library/react';
import ImagePreview from '../../components/ImagePreview';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => <img {...props} />
}));

describe('ImagePreview Component', () => {
  const defaultProps = {
    src: '/images/test.jpg',
    alt: 'Test Image'
  };

  test('renders thumbnail image', () => {
    render(<ImagePreview {...defaultProps} />);
    const thumbnail = screen.getByAltText(defaultProps.alt);
    expect(thumbnail).toBeInTheDocument();
    expect(thumbnail).toHaveAttribute('src', defaultProps.src);
  });

  test('opens preview modal on click', () => {
    render(<ImagePreview {...defaultProps} />);
    const thumbnail = screen.getByAltText(defaultProps.alt);
    fireEvent.click(thumbnail);
    
    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
    expect(screen.getByAltText(`${defaultProps.alt} (preview)`)).toBeInTheDocument();
  });

  test('closes preview on modal click', () => {
    render(<ImagePreview {...defaultProps} />);
    const thumbnail = screen.getByAltText(defaultProps.alt);
    fireEvent.click(thumbnail);
    
    const modal = screen.getByRole('dialog');
    fireEvent.click(modal);
    
    expect(modal).not.toBeVisible();
  });

  test('handles keyboard navigation', () => {
    render(<ImagePreview {...defaultProps} />);
    const thumbnail = screen.getByAltText(defaultProps.alt);
    
    // Open with Enter key
    fireEvent.keyDown(thumbnail, { key: 'Enter' });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    // Close with Escape key
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.getByRole('dialog')).not.toBeVisible();
  });

  test('applies zoom effect on hover', () => {
    render(<ImagePreview {...defaultProps} />);
    const container = screen.getByTestId('image-preview');
    
    fireEvent.mouseEnter(container);
    expect(container).toHaveClass('hover:scale-105');
    
    fireEvent.mouseLeave(container);
    expect(container).not.toHaveClass('hover:scale-105');
  });

  test('handles missing alt text', () => {
    const { src } = defaultProps;
    render(<ImagePreview src={src} />);
    
    const thumbnail = screen.getByRole('img');
    expect(thumbnail).toHaveAttribute('alt', '');
  });

  test('maintains aspect ratio', () => {
    render(<ImagePreview {...defaultProps} />);
    const container = screen.getByTestId('image-preview');
    expect(container).toHaveClass('aspect-ratio-box');
  });
});