/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Search from '../../components/Search';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}));

describe('Search Component', () => {
  const defaultProps = {
    onSearch: jest.fn(),
    initialQuery: ''
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders search input with accessibility attributes', () => {
    render(<Search {...defaultProps} />);
    
    const searchInput = screen.getByRole('searchbox');
    const searchButton = screen.getByRole('button');
    const searchLabel = screen.getByLabelText('Search posts');
    
    expect(searchInput).toHaveAttribute('aria-describedby', 'search-hint');
    expect(searchInput).toHaveAttribute('aria-label', 'Search posts');
    expect(searchButton).toHaveAttribute('aria-label', 'Submit search');
    expect(searchLabel).toBeInTheDocument();
  });

  test('handles form submission', async () => {
    const onSearch = jest.fn();
    render(<Search {...defaultProps} onSearch={onSearch} />);
    
    const input = screen.getByRole('searchbox');
    const form = screen.getByRole('search').querySelector('form');
    
    fireEvent.change(input, { target: { value: 'test query' } });
    fireEvent.submit(form);
    
    expect(onSearch).toHaveBeenCalledWith('test query');
  });

  test('disables search button when query is empty', () => {
    render(<Search {...defaultProps} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(button).not.toBeDisabled();
  });

  test('shows loading state during search', async () => {
    const slowSearch = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<Search {...defaultProps} onSearch={slowSearch} />);
    
    const input = screen.getByRole('searchbox');
    const form = screen.getByRole('search').querySelector('form');
    
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.submit(form);
    
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Searching...');
    
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  test('handles keyboard shortcut Ctrl+K', () => {
    render(<Search {...defaultProps} />);
    const input = screen.getByRole('searchbox');
    
    fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
    expect(document.activeElement).toBe(input);
  });

  test('handles keyboard shortcut Cmd+K', () => {
    render(<Search {...defaultProps} />);
    const input = screen.getByRole('searchbox');
    
    fireEvent.keyDown(document, { key: 'k', metaKey: true });
    expect(document.activeElement).toBe(input);
  });

  test('initializes with provided query', () => {
    render(<Search {...defaultProps} initialQuery="initial test" />);
    const input = screen.getByRole('searchbox');
    expect(input).toHaveValue('initial test');
  });

  test('trims query before submission', () => {
    const onSearch = jest.fn();
    render(<Search {...defaultProps} onSearch={onSearch} />);
    
    const input = screen.getByRole('searchbox');
    const form = screen.getByRole('search').querySelector('form');
    
    fireEvent.change(input, { target: { value: '  test query  ' } });
    fireEvent.submit(form);
    
    expect(onSearch).toHaveBeenCalledWith('test query');
  });

  test('handles search errors gracefully', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    const failedSearch = jest.fn(() => {
      throw new Error('Search failed');
    });
    
    render(<Search {...defaultProps} onSearch={failedSearch} />);
    
    const input = screen.getByRole('searchbox');
    const form = screen.getByRole('search').querySelector('form');
    
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.submit(form);
    
    expect(consoleError).toHaveBeenCalled();
    expect(input).not.toBeDisabled();
    
    consoleError.mockRestore();
  });

  test('renders within error boundary', () => {
    const ErrorComponent = () => {
      throw new Error('Test error');
    };

    render(
      <Search {...defaultProps}>
        <ErrorComponent />
      </Search>
    );

    expect(screen.getByRole('search')).toBeInTheDocument();
  });
});