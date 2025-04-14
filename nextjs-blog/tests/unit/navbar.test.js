/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from '../../components/Navbar';
import { useRouter } from 'next/router';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }) => <a href={href}>{children}</a>;
});

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => <img {...props} />
}));

describe('Navbar Component', () => {
  beforeEach(() => {
    useRouter.mockReset();
    useRouter.mockReturnValue({
      pathname: '/',
      push: jest.fn()
    });

    // Reset window width
    global.innerWidth = 1024;
    global.dispatchEvent(new Event('resize'));
  });

  test('renders navigation links', () => {
    render(<Navbar />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  test('highlights active link', () => {
    useRouter.mockReturnValue({ pathname: '/blog' });
    render(<Navbar />);
    expect(screen.getByText('Blog').closest('li')).toHaveClass('active');
  });

  test('toggles mobile menu', () => {
    global.innerWidth = 768;
    global.dispatchEvent(new Event('resize'));
    
    render(<Navbar />);
    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    
    fireEvent.click(menuButton);
    expect(screen.getByRole('navigation')).toHaveClass('show');
    
    fireEvent.click(menuButton);
    expect(screen.getByRole('navigation')).not.toHaveClass('show');
  });

  test('closes menu on window resize to desktop', () => {
    global.innerWidth = 768;
    global.dispatchEvent(new Event('resize'));
    
    render(<Navbar />);
    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    fireEvent.click(menuButton);
    
    global.innerWidth = 1024;
    global.dispatchEvent(new Event('resize'));
    
    expect(screen.getByRole('navigation')).not.toHaveClass('show');
  });

  test('handles keyboard navigation', () => {
    render(<Navbar />);
    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    
    fireEvent.keyDown(menuButton, { key: 'Enter' });
    expect(screen.getByRole('navigation')).toHaveClass('show');
    
    fireEvent.keyDown(menuButton, { key: 'Enter' });
    expect(screen.getByRole('navigation')).not.toHaveClass('show');
  });

  test('closes menu on escape key', () => {
    render(<Navbar />);
    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    
    fireEvent.click(menuButton);
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(screen.getByRole('navigation')).not.toHaveClass('show');
  });

  test('closes menu on outside click', () => {
    render(
      <>
        <Navbar />
        <div data-testid="outside">Outside</div>
      </>
    );
    
    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    fireEvent.click(menuButton);
    
    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.getByRole('navigation')).not.toHaveClass('show');
  });
});
