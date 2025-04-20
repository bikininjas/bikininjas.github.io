import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  it('calls onSearch when input changes', () => {
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} />);
    fireEvent.change(screen.getByPlaceholderText(/search articles/i), {
      target: { value: 'query' },
    });
    expect(onSearch).toHaveBeenCalledWith('query');
  });

  it('calls onSearch when button is clicked', () => {
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} />);
    const input = screen.getByPlaceholderText(/search articles/i);
    fireEvent.change(input, { target: { value: 'hello' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(onSearch).toHaveBeenCalledWith('hello');
  });
});
