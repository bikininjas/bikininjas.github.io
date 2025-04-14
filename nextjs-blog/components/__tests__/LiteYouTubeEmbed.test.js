import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import LiteYouTubeEmbed from '../LiteYouTubeEmbed';

describe('LiteYouTubeEmbed', () => {
  beforeEach(() => {
    // Mock IntersectionObserver functionality
    const mockIntersectionObserver = window.IntersectionObserver;
    
    // Create a spy to allow testing intersection behavior
    jest.spyOn(mockIntersectionObserver.prototype, 'observe');
    jest.spyOn(mockIntersectionObserver.prototype, 'unobserve');
  });

  it('renders with the correct video ID', () => {
    render(<LiteYouTubeEmbed id="dQw4w9WgXcQ" title="Rick Roll" />);
    
    const container = screen.getByTestId('lite-youtube-embed') || 
                      screen.getByLabelText('Rick Roll');
    
    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute('data-videoid', 'dQw4w9WgXcQ');
  });

  it('loads thumbnail image', () => {
    render(<LiteYouTubeEmbed id="dQw4w9WgXcQ" title="Rick Roll" />);
    
    const thumbnail = screen.getByRole('img', { hidden: true }) || 
                     document.querySelector('.lite-youtube-thumbnail');
    
    expect(thumbnail).toHaveStyle(`background-image: url(https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg)`);
  });

  it('plays video when clicked', () => {
    render(<LiteYouTubeEmbed id="dQw4w9WgXcQ" title="Rick Roll" />);
    
    const container = screen.getByTestId('lite-youtube-embed') || 
                      screen.getByLabelText('Rick Roll');
    
    // Before click, there should be no iframe
    expect(screen.queryByTitle('Rick Roll')).not.toBeInTheDocument();
    
    // Click to play video
    fireEvent.click(container);
    
    // After click, an iframe should be created
    const iframe = container.querySelector('iframe');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', expect.stringContaining('dQw4w9WgXcQ'));
  });

  it('applies custom start time when provided', () => {
    render(<LiteYouTubeEmbed id="dQw4w9WgXcQ" title="Rick Roll" start={30} />);
    
    const container = screen.getByTestId('lite-youtube-embed') || 
                      screen.getByLabelText('Rick Roll');
    
    fireEvent.click(container);
    
    const iframe = container.querySelector('iframe');
    expect(iframe).toHaveAttribute('src', expect.stringContaining('start=30'));
  });
});
