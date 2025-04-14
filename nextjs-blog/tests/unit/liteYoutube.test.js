/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LiteYouTubeEmbed from '../../components/LiteYouTubeEmbed';

describe('LiteYouTubeEmbed Component', () => {
  const defaultProps = {
    id: 'dQw4w9WgXcQ',
    title: 'Test Video'
  };

  beforeEach(() => {
    // Mock IntersectionObserver
    global.IntersectionObserver = class IntersectionObserver {
      constructor(callback) {
        this.callback = callback;
      }
      observe() {
        // Simulate intersection immediately
        this.callback([{ isIntersecting: true }]);
      }
      unobserve() {}
      disconnect() {}
    };
  });

  test('renders with required props', () => {
    render(<LiteYouTubeEmbed {...defaultProps} />);
    expect(screen.getByTestId('lite-youtube')).toBeInTheDocument();
    expect(screen.getByAltText(`${defaultProps.title} thumbnail`)).toBeInTheDocument();
  });

  test('loads thumbnail image', () => {
    render(<LiteYouTubeEmbed {...defaultProps} />);
    const thumbnail = screen.getByAltText(`${defaultProps.title} thumbnail`);
    expect(thumbnail).toHaveAttribute('src', `https://i.ytimg.com/vi/${defaultProps.id}/hqdefault.jpg`);
  });

  test('activates on click', () => {
    render(<LiteYouTubeEmbed {...defaultProps} />);
    const container = screen.getByTestId('lite-youtube');
    fireEvent.click(container);
    expect(container).toHaveClass('lyt-activated');
  });

  test('activates on Enter key', () => {
    render(<LiteYouTubeEmbed {...defaultProps} />);
    const container = screen.getByTestId('lite-youtube');
    fireEvent.keyDown(container, { key: 'Enter' });
    expect(container).toHaveClass('lyt-activated');
  });

  test('handles missing title', () => {
    const { id } = defaultProps;
    render(<LiteYouTubeEmbed id={id} />);
    expect(screen.getByTestId('lite-youtube')).toBeInTheDocument();
  });

  test('adds autoplay parameter when activated', () => {
    render(<LiteYouTubeEmbed {...defaultProps} />);
    const container = screen.getByTestId('lite-youtube');
    fireEvent.click(container);
    const iframe = screen.getByTitle(defaultProps.title);
    expect(iframe.src).toContain('autoplay=1');
  });

  test('applies custom parameters', () => {
    const params = {
      start: '30',
      controls: '0'
    };
    render(<LiteYouTubeEmbed {...defaultProps} params={params} />);
    const container = screen.getByTestId('lite-youtube');
    fireEvent.click(container);
    const iframe = screen.getByTitle(defaultProps.title);
    expect(iframe.src).toContain('start=30');
    expect(iframe.src).toContain('controls=0');
  });

  test('handles intersection observer callback', () => {
    render(<LiteYouTubeEmbed {...defaultProps} />);
    const container = screen.getByTestId('lite-youtube');
    expect(container).toHaveClass('lyt-observed');
  });

  test('handles unmounting', () => {
    const disconnect = jest.fn();
    global.IntersectionObserver = class {
      observe() {}
      unobserve() {}
      disconnect = disconnect;
    };

    const { unmount } = render(<LiteYouTubeEmbed {...defaultProps} />);
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });

  test('shows loading state initially', () => {
    render(<LiteYouTubeEmbed {...defaultProps} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('removes loading state after image loads', () => {
    render(<LiteYouTubeEmbed {...defaultProps} />);
    const img = screen.getByAltText(`${defaultProps.title} thumbnail`);
    fireEvent.load(img);
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  test('shows error state on image load failure', () => {
    render(<LiteYouTubeEmbed {...defaultProps} />);
    const img = screen.getByAltText(`${defaultProps.title} thumbnail`);
    fireEvent.error(img);
    expect(screen.getByText('Error loading video')).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  test('sets correct ARIA label', () => {
    render(<LiteYouTubeEmbed {...defaultProps} />);
    const container = screen.getByTestId('lite-youtube');
    expect(container).toHaveAttribute('aria-label', `Play ${defaultProps.title}`);
  });

  test('applies custom parameters to iframe src', () => {
    const params = { start: '30', controls: '0' };
    render(<LiteYouTubeEmbed {...defaultProps} params={params} />);
    
    const container = screen.getByTestId('lite-youtube');
    fireEvent.click(container);
    
    const iframe = screen.getByTitle(defaultProps.title);
    expect(iframe.src).toContain('start=30');
    expect(iframe.src).toContain('controls=0');
    expect(iframe.src).toContain('autoplay=1');
  });

  test('adds iframe with correct attributes', () => {
    render(<LiteYouTubeEmbed {...defaultProps} />);
    const container = screen.getByTestId('lite-youtube');
    fireEvent.click(container);
    
    const iframe = screen.getByTitle(defaultProps.title);
    expect(iframe).toHaveAttribute('allow', expect.stringContaining('accelerometer'));
    expect(iframe).toHaveAttribute('allow', expect.stringContaining('autoplay'));
    expect(iframe).toHaveAttribute('allowfullscreen');
  });

  test('handles keyboard interaction', () => {
    render(<LiteYouTubeEmbed {...defaultProps} />);
    const container = screen.getByTestId('lite-youtube');
    
    // Test non-Enter key
    fireEvent.keyDown(container, { key: 'Space' });
    expect(container).not.toHaveClass('lyt-activated');
    
    // Test Enter key
    fireEvent.keyDown(container, { key: 'Enter' });
    expect(container).toHaveClass('lyt-activated');
  });
});