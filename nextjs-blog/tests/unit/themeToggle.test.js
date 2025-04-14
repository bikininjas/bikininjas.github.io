/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThemeToggle from '../../components/ThemeToggle';

// Mock next-themes
const mockSetTheme = jest.fn();
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: mockSetTheme
  })
}));

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with accessibility attributes', () => {
    render(<ThemeToggle />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Switch to dark theme');
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveAttribute('aria-describedby', 'theme-shortcut');
  });

  test('handles click events', () => {
    render(<ThemeToggle />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  test('handles keyboard shortcut Ctrl+T', () => {
    render(<ThemeToggle />);
    
    fireEvent.keyDown(document, { key: 't', ctrlKey: true });
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  test('handles keyboard shortcut Cmd+T', () => {
    render(<ThemeToggle />);
    
    fireEvent.keyDown(document, { key: 't', metaKey: true });
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  test('shows keyboard shortcut hint', () => {
    render(<ThemeToggle />);
    
    const hint = screen.getByText(/Use Ctrl\+T \(Cmd\+T on Mac\) to toggle theme/);
    expect(hint).toBeInTheDocument();
    expect(hint).toHaveClass('sr-only');
  });

  test('renders correct icon based on theme', () => {
    const { rerender } = render(<ThemeToggle />);
    
    expect(screen.getByText('🌙')).toBeInTheDocument();

    // Mock theme as dark
    jest.resetModules();
    jest.mock('next-themes', () => ({
      useTheme: () => ({
        theme: 'dark',
        setTheme: mockSetTheme
      })
    }));

    rerender(<ThemeToggle />);
    expect(screen.getByText('🌞')).toBeInTheDocument();
  });

  test('renders within error boundary', () => {
    const ErrorComponent = () => {
      throw new Error('Test error');
    };

    render(
      <>
        <ThemeToggle />
        <ErrorComponent />
      </>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('cleanup removes event listener', () => {
    const { unmount } = render(<ThemeToggle />);
    
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalled();
    removeEventListenerSpy.mockRestore();
  });
});