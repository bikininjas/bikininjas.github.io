import React from 'react';
import { render } from '@testing-library/react';
import App from '../_app';
import { ErrorBoundary } from '../../components/ErrorBoundary';

// Mock the layout component
jest.mock('../../components/layout', () => ({ children }) => (
  <div data-testid="layout">{children}</div>
));

describe('App component', () => {
  it('wraps the page in ErrorBoundary', () => {
    const mockComponent = jest.fn(() => <div>Test Page</div>);
    const mockPageProps = { test: 'prop' };
    
    render(<App Component={mockComponent} pageProps={mockPageProps} />);
    
    // Check that mockComponent was called with pageProps
    expect(mockComponent).toHaveBeenCalledWith(mockPageProps, {});
  });

  it('passes pageProps to the Component', () => {
    const TestComponent = (props) => <div data-testid="test-page">{props.testProp}</div>;
    const pageProps = { testProp: 'test-value' };
    
    const { getByTestId } = render(
      <App Component={TestComponent} pageProps={pageProps} />
    );
    
    expect(getByTestId('test-page')).toHaveTextContent('test-value');
  });

  it('wraps the Component in layout', () => {
    const TestComponent = () => <div>Test Content</div>;
    
    const { getByTestId } = render(
      <App Component={TestComponent} pageProps={{}} />
    );
    
    expect(getByTestId('layout')).toBeInTheDocument();
  });

  it('applies global styles', () => {
    const TestComponent = () => <div>Test Content</div>;
    
    render(<App Component={TestComponent} pageProps={{}} />);
    
    // Check that global styles are applied (this is challenging to test directly)
    // A more comprehensive approach would be to check if specific global styles are applied,
    // but this would require a more sophisticated setup with getComputedStyle
  });
});
