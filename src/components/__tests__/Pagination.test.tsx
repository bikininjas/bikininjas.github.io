import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '../Pagination';

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 2,
    totalPages: 5,
    onPageChange: jest.fn(),
  };

  it('renders correct number of page buttons', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getAllByRole('button', { name: /\d+/ })).toHaveLength(5);
  });

  it('calls onPageChange with correct page when Prev/Next clicked', () => {
    render(<Pagination {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /prev/i }));
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(1);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(3);
  });

  it('disables Prev on first page', () => {
    render(<Pagination {...defaultProps} currentPage={1} />);
    expect(screen.getByRole('button', { name: /prev/i })).toBeDisabled();
  });

  it('disables Next on last page', () => {
    render(<Pagination {...defaultProps} currentPage={5} />);
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });
});
