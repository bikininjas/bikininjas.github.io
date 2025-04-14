import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '../ThemeToggle';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = String(value);
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock document.documentElement
Object.defineProperty(document, 'documentElement', {
  writable: true,
  value: {
    classList: {
      add: jest.fn(),
      remove: jest.fn()
    }
  }
});

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('renders toggle button', () => {
    render(<ThemeToggle />);
    
    const toggleButton = screen.getByRole('button') || 
                        screen.getByLabelText(/toggle theme/i) || 
                        screen.getByTestId('theme-toggle');
    
    expect(toggleButton).toBeInTheDocument();
  });

  it('applies default theme if no theme in localStorage', () => {
    render(<ThemeToggle />);
    
    // Default theme should be applied
    expect(document.documentElement.classList.add).toHaveBeenCalled();
  });

  it('loads theme from localStorage if available', () => {
    localStorage.getItem.mockReturnValueOnce('dark');
    render(<ThemeToggle />);
    
    expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark');
  });

  it('toggles theme when clicked', () => {
    render(<ThemeToggle />);
    
    const toggleButton = screen.getByRole('button') || 
                        screen.getByLabelText(/toggle theme/i) || 
                        screen.getByTestId('theme-toggle');
    
    // Initially should be in light mode (or default)
    fireEvent.click(toggleButton);
    
    // Should have toggled to dark mode
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark');
    
    // Click again to toggle back to light
    fireEvent.click(toggleButton);
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
    expect(document.documentElement.classList.remove).toHaveBeenCalledWith('dark');
  });
});
