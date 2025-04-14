import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Navbar from '../Navbar';
import { useRouter } from 'next/router';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

// Mock ThemeToggle component
jest.mock('../ThemeToggle', () => () => <button data-testid="theme-toggle">Toggle Theme</button>);

// Mock Search component
jest.mock('../Search', () => () => <div data-testid="search-component">Search</div>);

describe('Navbar', () => {
  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      pathname: '/',
      events: {
        on: jest.fn(),
        off: jest.fn()
      }
    }));
    
    // Mock window.scrollY and other needed properties
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 0
    });
    
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024
    });
  });

  it('renders the site title', () => {
    render(<Navbar />);
    const siteTitle = screen.getByRole('link', { name: /your site name/i });
    expect(siteTitle).toBeInTheDocument();
  });

  it('toggles mobile menu when hamburger is clicked', () => {
    render(<Navbar />);
    
    // Find the hamburger button
    const hamburger = screen.getByRole('button', { name: /menu/i }) || 
                     screen.getByLabelText(/menu/i) ||
                     screen.getByTestId('hamburger-button');
    
    // Menu should be closed initially
    const mobileMenu = screen.getByRole('navigation') || screen.getByTestId('mobile-nav');
    expect(mobileMenu).not.toHaveClass('open');
    
    // Click to open menu
    fireEvent.click(hamburger);
    expect(mobileMenu).toHaveClass('open');
    
    // Click again to close menu
    fireEvent.click(hamburger);
    expect(mobileMenu).not.toHaveClass('open');
  });

  it('changes navbar style on scroll', () => {
    render(<Navbar />);
    
    const navbar = screen.getByRole('navigation') || screen.getByTestId('navbar');
    expect(navbar).not.toHaveClass('scrolled');
    
    // Simulate scrolling
    window.scrollY = 100;
    fireEvent.scroll(window);
    
    expect(navbar).toHaveClass('scrolled');
  });

  it('renders ThemeToggle component', () => {
    render(<Navbar />);
    const themeToggle = screen.getByTestId('theme-toggle');
    expect(themeToggle).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Navbar />);
    
    // Check for common navigation links
    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toBeInTheDocument();
    
    const blogLink = screen.getByRole('link', { name: /blog/i });
    expect(blogLink).toBeInTheDocument();
  });
});
