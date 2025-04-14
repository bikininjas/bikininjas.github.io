import React from 'react';
import { render, screen } from '@testing-library/react';
import DateFormatter from '../../components/DateFormatter';

describe('DateFormatter Component', () => {
  const defaultProps = {
    dateString: '2023-01-01'
  };

  test('formats date correctly', () => {
    render(<DateFormatter {...defaultProps} />);
    expect(screen.getByText('January 1, 2023')).toBeInTheDocument();
  });

  test('formats future date', () => {
    render(<DateFormatter dateString="2024-12-31" />);
    expect(screen.getByText('December 31, 2024')).toBeInTheDocument();
  });

  test('handles invalid date string', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<DateFormatter dateString="invalid-date" />);
    expect(screen.getByText('Invalid Date')).toBeInTheDocument();
    consoleSpy.mockRestore();
  });

  test('handles empty date string', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<DateFormatter dateString="" />);
    expect(screen.getByText('Invalid Date')).toBeInTheDocument();
    consoleSpy.mockRestore();
  });

  test('handles undefined date string', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<DateFormatter />);
    expect(screen.getByText('Invalid Date')).toBeInTheDocument();
    consoleSpy.mockRestore();
  });

  test('formats date with time', () => {
    render(<DateFormatter dateString="2023-01-01T12:00:00Z" />);
    expect(screen.getByText('January 1, 2023')).toBeInTheDocument();
  });

  test('handles different date formats', () => {
    const dates = [
      { input: '2023/01/01', expected: 'January 1, 2023' },
      { input: '2023.01.01', expected: 'January 1, 2023' },
      { input: '01-01-2023', expected: 'January 1, 2023' }
    ];

    dates.forEach(({ input, expected }) => {
      const { rerender } = render(<DateFormatter dateString={input} />);
      expect(screen.getByText(expected)).toBeInTheDocument();
      rerender(<div />); // Clear previous render
    });
  });

  test('handles leap year dates', () => {
    render(<DateFormatter dateString="2024-02-29" />);
    expect(screen.getByText('February 29, 2024')).toBeInTheDocument();
  });

  test('handles timezone differences', () => {
    const date = new Date('2023-01-01T00:00:00Z').toISOString();
    render(<DateFormatter dateString={date} />);
    expect(screen.getByText('January 1, 2023')).toBeInTheDocument();
  });

  test('consistent output across timezones', () => {
    const dates = [
      '2023-01-01T00:00:00Z',
      '2023-01-01T00:00:00+01:00',
      '2023-01-01T00:00:00-01:00'
    ];

    dates.forEach(date => {
      const { rerender } = render(<DateFormatter dateString={date} />);
      expect(screen.getByText('January 1, 2023')).toBeInTheDocument();
      rerender(<div />);
    });
  });
});