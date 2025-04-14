import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PostParallax from '../../components/PostParallax';

describe('PostParallax Component', () => {
  const defaultProps = {
    title: 'Test Post Title',
    backgroundImage: '/images/test.jpg'
  };

  beforeEach(() => {
    // Mock window scroll and resize
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0
    });

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 800
    });
  });

  test('renders with required props', () => {
    render(<PostParallax {...defaultProps} />);
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
  });

  test('applies background image', () => {
    render(<PostParallax {...defaultProps} />);
    const background = screen.getByTestId('post-parallax-background');
    expect(background.style.backgroundImage).toContain(defaultProps.backgroundImage);
  });

  test('handles scroll events', () => {
    render(<PostParallax {...defaultProps} />);
    const parallax = screen.getByTestId('post-parallax');

    // Test initial position
    expect(parallax.style.transform).toBe('translateY(0px)');

    // Test after scroll
    window.scrollY = 100;
    fireEvent.scroll(window);
    expect(parallax.style.transform).toBe('translateY(50px)');
  });

  test('handles window resize', () => {
    render(<PostParallax {...defaultProps} />);
    const parallax = screen.getByTestId('post-parallax');

    // Change window height
    window.innerHeight = 1000;
    fireEvent.resize(window);

    // Test scroll after resize
    window.scrollY = 100;
    fireEvent.scroll(window);
    expect(parallax.style.transform).toBe('translateY(50px)');
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
    const { backgroundImage, ...propsWithoutBackground } = defaultProps;
    render(<PostParallax {...propsWithoutBackground} />);
    const background = screen.getByTestId('post-parallax-background');
    expect(background.style.backgroundImage).toBe('');
  });

  test('applies parallax effect within boundaries', () => {
    render(<PostParallax {...defaultProps} />);
    const parallax = screen.getByTestId('post-parallax');

    // Test upper boundary
    window.scrollY = -100;
    fireEvent.scroll(window);
    expect(parallax.style.transform).toBe('translateY(0px)');

    // Test lower boundary
    window.scrollY = 2000;
    fireEvent.scroll(window);
    expect(parallax.style.transform).toBe('translateY(400px)');
  });

  test('handles rapid scroll events', () => {
    render(<PostParallax {...defaultProps} />);
    const parallax = screen.getByTestId('post-parallax');

    // Simulate rapid scrolling
    for (let i = 0; i < 10; i++) {
      window.scrollY += 50;
      fireEvent.scroll(window);
    }

    expect(parallax.style.transform).toBe('translateY(250px)');
  });

  test('maintains aspect ratio on resize', () => {
    render(<PostParallax {...defaultProps} />);
    const container = screen.getByTestId('post-parallax-container');

    window.innerHeight = 1200;
    fireEvent.resize(window);

    expect(container.style.height).toBe('600px');
  });
});
