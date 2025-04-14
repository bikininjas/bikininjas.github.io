/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostParallax from '../../components/PostParallax';

describe('PostParallax Component', () => {
  const defaultProps = {
    title: 'Test Post',
    imageUrl: '/test-image.jpg',
    category: 'Tech',
    date: '2023-01-01'
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

  test('renders with required props', () => {
    render(<PostParallax {...defaultProps} />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
  });

  test('applies background image', () => {
    render(<PostParallax {...defaultProps} />);
    const parallaxImage = screen.getByTestId('hero-parallax');
    expect(parallaxImage.style.backgroundImage).toContain(defaultProps.imageUrl);
  });

  test('handles scroll events', () => {
    render(<PostParallax {...defaultProps} />);
    const parallax = screen.getByTestId('hero-parallax');

    // Test initial position
    expect(parallax.style.transform).toBe('translateY(0px)');

    // Test after scroll
    mockWindow.scrollY = 100;
    fireEvent.scroll(window);
    expect(parallax.style.transform).toBe('translateY(30px)');
  });

  test('handles window resize', () => {
    render(<PostParallax {...defaultProps} />);
    const parallax = screen.getByTestId('hero-parallax');

    // Change window height
    mockWindow.innerHeight = 1000;
    fireEvent.resize(window);

    // Test scroll after resize
    mockWindow.scrollY = 100;
    fireEvent.scroll(window);
    expect(parallax.style.transform).toBe('translateY(30px)');
  });

  test('adds and removes event listeners', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = render(<PostParallax {...defaultProps} />);

    expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  test('handles missing background image', () => {
    const { imageUrl, ...propsWithoutBackground } = defaultProps;
    render(<PostParallax {...propsWithoutBackground} />);
    const parallaxImage = screen.getByTestId('hero-parallax');
    expect(parallaxImage.style.backgroundImage).toBe('');
  });

  test('applies parallax effect within boundaries', () => {
    render(<PostParallax {...defaultProps} />);
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

  test('handles rapid scroll events', () => {
    render(<PostParallax {...defaultProps} />);
    const parallax = screen.getByTestId('hero-parallax');

    // Simulate rapid scrolling
    for (let i = 0; i < 10; i++) {
      mockWindow.scrollY += 50;
      fireEvent.scroll(window);
    }

    expect(parallax.style.transform).toBe('translateY(250px)');
  });

  test('maintains aspect ratio on resize', () => {
    render(<PostParallax {...defaultProps} />);
    const container = screen.getByTestId('post-parallax-container');

    mockWindow.innerHeight = 1200;
    fireEvent.resize(window);

    expect(container.style.height).toBe('600px');
  });

  test('sets correct ARIA attributes', () => {
    render(<PostParallax {...defaultProps} />);
    
    const banner = screen.getByRole('banner');
    const parallaxImage = screen.getByTestId('hero-parallax');
    
    expect(banner).toHaveAttribute('aria-label', 'Post header image');
    expect(parallaxImage).toHaveAttribute('aria-hidden', 'true');
  });

  test('handles intersection observer error gracefully', () => {
    global.IntersectionObserver = class {
      constructor() {
        throw new Error('IntersectionObserver error');
      }
    };

    render(<PostParallax {...defaultProps} />);
    expect(screen.getByRole('banner')).toHaveClass('post-header-fallback');
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
  });

  test('cleans up event listeners on unmount', () => {
    const removeEventListener = jest.spyOn(window, 'removeEventListener');
    const { unmount } = render(<PostParallax {...defaultProps} />);
    
    unmount();
    expect(removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  test('renders date and category when provided', () => {
    render(<PostParallax {...defaultProps} />);
    expect(screen.getByText('2023-01-01')).toBeInTheDocument();
    expect(screen.getByText('Tech')).toBeInTheDocument();
  });

  test('handles missing optional props', () => {
    const { imageUrl, category, date, ...requiredProps } = defaultProps;
    render(<PostParallax {...requiredProps} />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText(requiredProps.title)).toBeInTheDocument();
  });

  test('uses fallback image for unknown category', () => {
    const props = {
      ...defaultProps,
      category: 'Unknown',
      imageUrl: undefined
    };
    render(<PostParallax {...props} />);
    const parallaxImage = screen.getByTestId('hero-parallax');
    expect(parallaxImage.style.backgroundImage).toContain('unsplash');
  });

  test('renders within error boundary', () => {
    const ErrorComponent = () => {
      throw new Error('Test error');
    };

    render(
      <PostParallax {...defaultProps}>
        <ErrorComponent />
      </PostParallax>
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
});
