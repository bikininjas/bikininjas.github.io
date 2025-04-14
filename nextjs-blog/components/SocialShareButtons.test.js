import { render, screen, fireEvent, act } from '@testing-library/react';
import SocialShareButtons from './SocialShareButtons';

describe('SocialShareButtons', () => {
  const mockUrl = 'https://example.com';
  const mockTitle = 'Test Title';
  const originalClipboard = { ...global.navigator.clipboard };
  const mockOpen = jest.fn();

  beforeAll(() => {
    global.window.open = mockOpen;
    global.navigator.clipboard = {
      writeText: jest.fn()
    };
  });

  afterAll(() => {
    global.navigator.clipboard = originalClipboard;
  });

  beforeEach(() => {
    mockOpen.mockClear();
    global.navigator.clipboard.writeText.mockClear();
  });

  it('renders all share buttons with proper accessibility attributes', () => {
    render(<SocialShareButtons url={mockUrl} title={mockTitle} />);
    
    const buttonGroup = screen.getByRole('group', { name: /share this article/i });
    expect(buttonGroup).toBeInTheDocument();

    expect(screen.getByLabelText(/share on twitter/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/share on facebook/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/share on linkedin/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/copy link/i)).toBeInTheDocument();
  });

  it('opens share links in new window when clicked', () => {
    render(<SocialShareButtons url={mockUrl} title={mockTitle} />);
    
    fireEvent.click(screen.getByLabelText(/share on twitter/i));
    expect(mockOpen).toHaveBeenCalledWith(
      expect.stringContaining('twitter.com'),
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('copies link to clipboard and shows confirmation', async () => {
    global.navigator.clipboard.writeText.mockResolvedValueOnce();
    jest.useFakeTimers();

    render(<SocialShareButtons url={mockUrl} title={mockTitle} />);
    
    const copyButton = screen.getByLabelText(/copy link/i);
    fireEvent.click(copyButton);

    expect(global.navigator.clipboard.writeText).toHaveBeenCalledWith(mockUrl);
    expect(screen.getByText(/link copied/i)).toBeInTheDocument();
    expect(copyButton).toHaveAttribute('aria-pressed', 'true');

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(screen.queryByText(/link copied/i)).not.toBeInTheDocument();
    expect(copyButton).toHaveAttribute('aria-pressed', 'false');

    jest.useRealTimers();
  });

  it('handles clipboard errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    global.navigator.clipboard.writeText.mockRejectedValueOnce(new Error('Clipboard error'));

    render(<SocialShareButtons url={mockUrl} title={mockTitle} />);
    
    fireEvent.click(screen.getByLabelText(/copy link/i));
    
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});