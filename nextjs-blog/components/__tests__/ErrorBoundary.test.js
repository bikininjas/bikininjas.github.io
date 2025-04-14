import React from 'react';
import { render } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary';

describe('ErrorBoundary', () => {
  // Save original console.error
  const originalError = console.error;
  
  beforeAll(() => {
    // Suppress console.error for clean test output
    console.error = jest.fn();
  });
  
  afterAll(() => {
    // Restore original console.error
    console.error = originalError;
  });

  it('renders children when there is no error', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <div>Test child component</div>
      </ErrorBoundary>
    );
    
    expect(getByText('Test child component')).toBeInTheDocument();
  });

  it('renders error UI when child component throws', () => {
    const ErrorComponent = () => {
      throw new Error('Test error');
    };

    const { getByText } = render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );
    
    expect(getByText(/Something went wrong/i)).toBeInTheDocument();
  });

  it('calls componentDidCatch when an error occurs', () => {
    const spy = jest.spyOn(ErrorBoundary.prototype, 'componentDidCatch');
    const ErrorComponent = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );
    
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
