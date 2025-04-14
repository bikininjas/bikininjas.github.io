/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary from '../../components/ErrorBoundary';

const ThrowError = () => {
  throw new Error('Test error');
};

const originalError = console.error;
const originalEnv = process.env.NODE_ENV;

describe('ErrorBoundary Component', () => {
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
    process.env.NODE_ENV = originalEnv;
  });

  beforeEach(() => {
    console.error.mockClear();
  });

  test('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('renders error UI when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('sets correct ARIA attributes', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'assertive');
  });

  test('shows error details in development mode', () => {
    process.env.NODE_ENV = 'development';
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Error details')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  test('hides error details in production mode', () => {
    process.env.NODE_ENV = 'production';
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.queryByText('Error details')).not.toBeInTheDocument();
  });

  test('logs error to console', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(console.error).toHaveBeenCalled();
  });

  test('refresh button reloads the page', () => {
    const reloadMock = jest.fn();
    delete window.location;
    window.location = { reload: reloadMock };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(reloadMock).toHaveBeenCalled();
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