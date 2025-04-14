import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ParallaxHero from '../../components/ParallaxHero';

// Mock de useState pour pouvoir tester les mises à jour d'état
const mockSetOffset = jest.fn();
jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    useState: jest.fn((initialValue) => [initialValue, mockSetOffset]),
  };
});

describe('ParallaxHero Component', () => {
  const defaultProps = {
    title: 'Welcome to My Blog',
    subtitle: 'A journey through code and technology',
    backgroundImage: '/images/hero.jpg'
  };

  beforeEach(() => {
    // Reset mocks before each test
    mockSetOffset.mockClear();
    window.scrollY = 0;

    // Mock window scroll event
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
      configurable: true
    });

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 800
    });
  });

  test('renders hero content', () => {
    render(<ParallaxHero {...defaultProps} />);
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.subtitle)).toBeInTheDocument();
  });

  test('applies background image', () => {
    render(<ParallaxHero {...defaultProps} />);
    const background = screen.getByTestId('hero-background');
    expect(background.style.backgroundImage).toContain(defaultProps.backgroundImage);
  });

  test('handles scroll events', () => {
    render(<ParallaxHero {...defaultProps} />);
    const parallax = screen.getByTestId('hero-parallax');

    // Test initial position
    expect(parallax.style.transform).toBe('translateY(0px)');

    // Test after scroll
    window.scrollY = 100;
    fireEvent.scroll(window);
    expect(parallax.style.transform).toBe('translateY(50px)');
  });

  test('handles window resize', () => {
    render(<ParallaxHero {...defaultProps} />);
    const hero = screen.getByTestId('hero-container');

    // Change window height
    window.innerHeight = 1000;
    fireEvent.resize(window);

    expect(hero.style.height).toBe('500px');
  });

  test('adds and removes event listeners', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = render(<ParallaxHero {...defaultProps} />);

    expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
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
    window.scrollY = -100;
    fireEvent.scroll(window);
    expect(parallax.style.transform).toBe('translateY(0px)');

    // Test lower boundary
    window.scrollY = 2000;
    fireEvent.scroll(window);
    expect(parallax.style.transform).toBe('translateY(400px)');
  });

  test('maintains aspect ratio on resize', () => {
    render(<ParallaxHero {...defaultProps} />);
    const container = screen.getByTestId('hero-container');

    // Test different window heights
    const heights = [600, 800, 1000, 1200];
    heights.forEach(height => {
      window.innerHeight = height;
      fireEvent.resize(window);
      expect(container.style.height).toBe(`${height / 2}px`);
    });
  });

  test('handles rapid scroll events', () => {
    render(<ParallaxHero {...defaultProps} />);
    const parallax = screen.getByTestId('hero-parallax');

    // Simulate rapid scrolling
    for (let i = 0; i < 10; i++) {
      window.scrollY += 50;
      fireEvent.scroll(window);
    }

    expect(parallax.style.transform).toBe('translateY(250px)');
  });

});
