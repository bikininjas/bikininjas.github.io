import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import MyApp from '../../pages/_app';

describe('MyApp Component', () => {
  test('renders the component with pageProps', () => {
    // Mock Component that would be passed to MyApp
    const MockComponent = jest.fn(({ testProp }) => (
      <div data-testid="mock-component" data-test-prop={testProp}>
        Test Component
      </div>
    ));
    
    // Mock pageProps
    const pageProps = { testProp: 'test-value' };
    
    // Render MyApp with the mocked Component and pageProps
    const { getByTestId } = render(
      <MyApp Component={MockComponent} pageProps={pageProps} />
    );
    
    // Check if the Component was rendered with the correct props
    const renderedComponent = getByTestId('mock-component');
    expect(renderedComponent).toBeInTheDocument();
    expect(renderedComponent).toHaveAttribute('data-test-prop', 'test-value');
    expect(renderedComponent).toHaveTextContent('Test Component');
    
    // Check if the Component was called
    expect(MockComponent).toHaveBeenCalled();
    
    // Vérifier que le premier argument contient les pageProps
    const firstArg = MockComponent.mock.calls[0][0];
    expect(firstArg).toEqual(expect.objectContaining(pageProps));
  });
});
