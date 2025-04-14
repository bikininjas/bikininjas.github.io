import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../../components/ErrorBoundary';

describe('ErrorBoundary Component', () => {
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  test('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('renders error message when error occurs', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(screen.getByText('Please try again later.')).toBeInTheDocument();
  });

  test('renders custom error message when provided', () => {
    const customError = 'Custom error message';
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary errorMessage={customError}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(customError)).toBeInTheDocument();
  });

  test('calls error logging function when error occurs', () => {
    const mockLogError = jest.fn();
    const error = new Error('Test error');
    const errorInfo = { componentStack: 'Component stack' };

    const boundary = new ErrorBoundary({ children: <div>Test</div> });
    boundary.logError = mockLogError;
    boundary.componentDidCatch(error, errorInfo);

    expect(mockLogError).toHaveBeenCalledWith(error, errorInfo);
  });

  test('resets error state when receiving new children', () => {
    const boundary = new ErrorBoundary({ children: <div>Test</div> });
    boundary.setState({ hasError: true });

    boundary.componentDidUpdate({ children: <div>New Test</div> });
    expect(boundary.state.hasError).toBe(false);
  });

  test('handles nested errors', () => {
    const NestedError = () => {
      const ThrowError = () => {
        throw new Error('Nested error');
      };
      return <ThrowError />;
    };

    render(
      <ErrorBoundary>
        <NestedError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
  });

  test('handles multiple errors', () => {
    const MultipleErrors = () => {
      throw new Error('Multiple errors');
    };

    render(
      <ErrorBoundary>
        <MultipleErrors />
        <MultipleErrors />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(screen.queryAllByText('Something went wrong.')).toHaveLength(1);
  });
});