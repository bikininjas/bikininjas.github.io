/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import SocialShareButtons from './SocialShareButtons';

describe('SocialShareButtons', () => {
  const mockUrl = 'https://example.com/test';
  const mockTitle = 'Test Title';
  let mockOpen;
  
  beforeEach(() => {
    // Setup window.open mock
    mockOpen = jest.fn();
    window.open = mockOpen;
    
    // Setup clipboard mock
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: jest.fn().mockImplementation(() => Promise.resolve())
      },
      configurable: true
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('renders all share buttons with proper accessibility attributes', () => {
    render(<SocialShareButtons url={mockUrl} title={mockTitle} />);
    
    // Check all buttons are rendered
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(4); // Twitter, Facebook, LinkedIn, Copy
    
    // Check accessibility attributes
    buttons.forEach(button => {
      expect(button).toHaveAttribute('aria-label');
    });
  });

  test('opens share links in new window when clicked', () => {
    render(<SocialShareButtons url={mockUrl} title={mockTitle} />);
    
    // Click Twitter button
    const twitterButton = screen.getByLabelText(/share on twitter/i);
    fireEvent.click(twitterButton);
    
    expect(mockOpen).toHaveBeenCalledTimes(1);
    expect(mockOpen).toHaveBeenCalledWith(
      expect.stringContaining('twitter.com/intent/tweet'),
      '_blank',
      'noopener,noreferrer'
    );
  });

  test('copies link to clipboard and shows confirmation', async () => {
    render(<SocialShareButtons url={mockUrl} title={mockTitle} />);
    
    // Click copy button
    const copyButton = screen.getByLabelText(/copy link/i);
    fireEvent.click(copyButton);
    
    // Check clipboard was called
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockUrl);
    
    // Check confirmation shows
    const confirmation = await screen.findByText(/copied/i);
    expect(confirmation).toBeInTheDocument();
  });

  test('handles clipboard errors gracefully', async () => {
    // Mock clipboard failure
    navigator.clipboard.writeText.mockRejectedValueOnce(new Error('Clipboard error'));
    
    render(<SocialShareButtons url={mockUrl} title={mockTitle} />);
    
    // Click copy button
    const copyButton = screen.getByLabelText(/copy link/i);
    fireEvent.click(copyButton);
    
    // Check error handling
    const errorMessage = await screen.findByText(/failed to copy/i);
    expect(errorMessage).toBeInTheDocument();
  });
});