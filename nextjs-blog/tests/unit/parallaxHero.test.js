/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ParallaxHero from '../../components/ParallaxHero';

describe('ParallaxHero Component', () => {
  const defaultProps = {
    title: 'Welcome',
    subtitle: 'Test Subtitle',
    backgroundImage: '/images/hero.jpg'
  };

  let originalWindow;
  let mockWindow;

  beforeEach(() => {
    // Save original window
    originalWindow = global.window;

    // Create mock window with all required properties
    mockWindow = {
      ...originalWindow,
      scrollY: 0,
      innerHeight: 800,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      requestAnimationFrame: jest.fn(cb => cb()),
      cancelAnimationFrame: jest.fn()
    };

    // Mock window scroll and resize
    Object.defineProperty(global, 'window', {
      value: mockWindow,
      writable: true
    });

    // Mock IntersectionObserver
    global.IntersectionObserver = class IntersectionObserver {
      constructor(callback) {
        this.callback = callback;
      }
      observe() {
        this.callback([{ isIntersecting: true }]);
      }
      disconnect() {}
    };

    // Reset all mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore original window
    global.window = originalWindow;
  });

  test('renders with default props', () => {
    render(<ParallaxHero />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText('Welcome')).toBeInTheDocument();
    expect(screen.getByText('Explore our stories')).toBeInTheDocument();
  });

  test('renders with custom props', () => {
    render(<ParallaxHero {...defaultProps} />);
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.subtitle)).toBeInTheDocument();
  });

  test('applies background image', () => {
    render(<ParallaxHero {...defaultProps} />);
    const background = screen.getByTestId('hero-background');
    expect(background.style.backgroundImage).toContain(defaultProps.backgroundImage);
  });

  test('applies parallax effect on scroll', () => {
    render(<ParallaxHero {...defaultProps} />);
    const parallax = screen.getByTestId('hero-parallax');
    
    window.scrollY = 100;
    fireEvent.scroll(window);
    
    expect(parallax.style.transform).toBe('translateY(50px)');
  });

  test('updates container height on resize', () => {
    render(<ParallaxHero {...defaultProps} />);
    const container = screen.getByTestId('hero-container');
    
    Object.defineProperty(window, 'innerHeight', { value: 800 });
    fireEvent.resize(window);
    
    expect(container.style.height).toBe('400px');
  });

  test('handles intersection observer callback', () => {
    render(<ParallaxHero {...defaultProps} />);
    const parallax = screen.getByTestId('hero-parallax');
    window.scrollY = 100;
    fireEvent.scroll(window);
    expect(parallax.style.transform).toBe('translateY(50px)');
  });

  test('handles error cases gracefully', () => {
    // Mock IntersectionObserver to throw error
    global.IntersectionObserver = class {
      constructor() {
        throw new Error('Test error');
      }
    };

    render(<ParallaxHero {...defaultProps} />);
    expect(screen.getByRole('banner')).toHaveClass('hero-fallback');
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.subtitle)).toBeInTheDocument();
  });

  test('sets correct ARIA attributes', () => {
    render(<ParallaxHero {...defaultProps} />);
    const banner = screen.getByRole('banner');
    expect(banner).toHaveAttribute('aria-label', 'Hero section');
    expect(screen.getByTestId('hero-parallax')).toHaveAttribute('aria-hidden', 'true');
  });

  test('cleans up event listeners on unmount', () => {
    const removeEventListener = jest.spyOn(window, 'removeEventListener');
    const { unmount } = render(<ParallaxHero {...defaultProps} />);
    
    unmount();
    
    expect(removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
    expect(removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  test('handles missing background image', () => {
    const { backgroundImage, ...propsWithoutBackground } = defaultProps;
    render(<ParallaxHero {...propsWithoutBackground} />);
    const background = screen.getByTestId('hero-background');
    expect(background.style.backgroundImage).toBe('');
  });

  test('applies parallax effect within boundaries', () => {
    render(<ParallaxHero {...defaultProps} />);
    const parallax = screen.getByTestId('hero-parallax');

    // Test upper boundary
    mockWindow.scrollY = -100;
    fireEvent.scroll(window);
    expect(parallax.style.transform).toBe('translateY(0px)');

    // Test lower boundary
    mockWindow.scrollY = 2000;
    fireEvent.scroll(window);
    expect(parallax.style.transform).toBe('translateY(400px)');
  });

  test('maintains aspect ratio on resize', () => {
    render(<ParallaxHero {...defaultProps} />);
    const container = screen.getByTestId('hero-container');

    // Test different window heights
    const heights = [600, 800, 1000, 1200];
    heights.forEach(height => {
      mockWindow.innerHeight = height;
      fireEvent.resize(window);
      expect(container.style.height).toBe(`${height / 2}px`);
    });
  });

  test('handles rapid scroll events', () => {
    render(<ParallaxHero {...defaultProps} />);
    const parallax = screen.getByTestId('hero-parallax');

    // Simulate rapid scrolling
    for (let i = 0; i < 10; i++) {
      mockWindow.scrollY += 50;
      fireEvent.scroll(window);
    }

    expect(parallax.style.transform).toBe('translateY(250px)');
    expect(mockWindow.requestAnimationFrame).toHaveBeenCalled();
  });

});
