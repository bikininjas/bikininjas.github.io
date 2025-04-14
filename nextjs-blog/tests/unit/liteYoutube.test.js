import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LiteYouTube from '../../components/LiteYouTube';

describe('LiteYouTube Component', () => {
  const defaultProps = {
    videoId: 'dQw4w9WgXcQ',
    title: 'Test Video'
  };

  beforeEach(() => {
    // Mock IntersectionObserver
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  test('renders with required props', () => {
    render(<LiteYouTube {...defaultProps} />);
    expect(screen.getByTestId('lite-youtube')).toBeInTheDocument();
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
  });

  test('loads video thumbnail', () => {
    render(<LiteYouTube {...defaultProps} />);
    const thumbnail = screen.getByAltText(`${defaultProps.title} thumbnail`);
    expect(thumbnail).toHaveAttribute('src', `https://i.ytimg.com/vi/${defaultProps.videoId}/hqdefault.jpg`);
  });

  test('handles click event', () => {
    render(<LiteYouTube {...defaultProps} />);
    const container = screen.getByTestId('lite-youtube');
    fireEvent.click(container);
    expect(container).toHaveClass('lyt-activated');
  });

  test('handles keyboard navigation', () => {
    render(<LiteYouTube {...defaultProps} />);
    const container = screen.getByTestId('lite-youtube');
    fireEvent.keyDown(container, { key: 'Enter' });
    expect(container).toHaveClass('lyt-activated');
  });

  test('handles missing title prop', () => {
    const { videoId } = defaultProps;
    render(<LiteYouTube videoId={videoId} />);
    expect(screen.getByTestId('lite-youtube')).toBeInTheDocument();
  });

  test('handles invalid video ID', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<LiteYouTube {...defaultProps} videoId="invalid-id" />);
    expect(screen.getByTestId('lite-youtube')).toHaveAttribute('data-videoid', 'invalid-id');
    consoleSpy.mockRestore();
  });

  test('loads high quality thumbnail when specified', () => {
    render(<LiteYouTube {...defaultProps} quality="maxresdefault" />);
    const thumbnail = screen.getByAltText(`${defaultProps.title} thumbnail`);
    expect(thumbnail).toHaveAttribute('src', `https://i.ytimg.com/vi/${defaultProps.videoId}/maxresdefault.jpg`);
  });

  test('handles intersection observer callback', () => {
    render(<LiteYouTube {...defaultProps} />);
    const container = screen.getByTestId('lite-youtube');
    
    // Simulate intersection
    const observerCallback = window.IntersectionObserver.mock.calls[0][0];
    observerCallback([{ isIntersecting: true }]);
    
    expect(container).toHaveClass('lyt-observed');
  });

  test('cleans up observer on unmount', () => {
    const disconnect = jest.fn();
    window.IntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect
    });

    const { unmount } = render(<LiteYouTube {...defaultProps} />);
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });

  test('handles play button click', () => {
    render(<LiteYouTube {...defaultProps} />);
    const playButton = screen.getByLabelText('Play');
    fireEvent.click(playButton);
    expect(screen.getByTestId('lite-youtube')).toHaveClass('lyt-activated');
  });

  test('sets correct iframe source', () => {
    render(<LiteYouTube {...defaultProps} />);
    const container = screen.getByTestId('lite-youtube');
    fireEvent.click(container);
    
    const iframe = screen.getByTitle(defaultProps.title);
    expect(iframe).toHaveAttribute('src', expect.stringContaining(defaultProps.videoId));
  });
});