import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../../components/Navbar';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

describe('Navbar Component', () => {
  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      pathname: '/',
      push: jest.fn()
    }));
  });

  test('renders logo and navigation links', () => {
    render(<Navbar />);
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  test('toggles mobile menu', () => {
    render(<Navbar />);
    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    
    expect(screen.getByRole('navigation')).not.toHaveClass('show');
    fireEvent.click(menuButton);
    expect(screen.getByRole('navigation')).toHaveClass('show');
    fireEvent.click(menuButton);
    expect(screen.getByRole('navigation')).not.toHaveClass('show');
  });

  test('closes mobile menu when clicking outside', () => {
    render(<Navbar />);
    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    
    fireEvent.click(menuButton);
    expect(screen.getByRole('navigation')).toHaveClass('show');
    
    fireEvent.mouseDown(document.body);
    expect(screen.getByRole('navigation')).not.toHaveClass('show');
  });

  test('highlights active link based on current route', () => {
    useRouter.mockImplementation(() => ({
      pathname: '/blog',
      push: jest.fn()
    }));

    render(<Navbar />);
    expect(screen.getByText('Blog').parentElement).toHaveClass('active');
    expect(screen.getByText('Home').parentElement).not.toHaveClass('active');
  });

  test('handles logo click navigation', () => {
    const pushMock = jest.fn();
    useRouter.mockImplementation(() => ({
      pathname: '/blog',
      push: pushMock
    }));

    render(<Navbar />);
    fireEvent.click(screen.getByAltText('Logo'));
    expect(pushMock).toHaveBeenCalledWith('/');
  });

  test('handles navigation link clicks', () => {
    const pushMock = jest.fn();
    useRouter.mockImplementation(() => ({
      pathname: '/',
      push: pushMock
    }));

    render(<Navbar />);
    fireEvent.click(screen.getByText('Blog'));
    expect(pushMock).toHaveBeenCalledWith('/blog');
  });

  test('handles window resize', () => {
    render(<Navbar />);
    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    
    fireEvent.click(menuButton);
    expect(screen.getByRole('navigation')).toHaveClass('show');
    
    // Simulate resize to desktop width
    fireEvent.resize(window, { target: { innerWidth: 1024 } });
    expect(screen.getByRole('navigation')).not.toHaveClass('show');
  });

  test('keyboard accessibility for menu button', () => {
    render(<Navbar />);
    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    
    menuButton.focus();
    fireEvent.keyDown(menuButton, { key: 'Enter' });
    expect(screen.getByRole('navigation')).toHaveClass('show');
    
    fireEvent.keyDown(menuButton, { key: 'Enter' });
    expect(screen.getByRole('navigation')).not.toHaveClass('show');
  });

  test('handles escape key to close menu', () => {
    render(<Navbar />);
    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    
    fireEvent.click(menuButton);
    expect(screen.getByRole('navigation')).toHaveClass('show');
    
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.getByRole('navigation')).not.toHaveClass('show');
  });
});
