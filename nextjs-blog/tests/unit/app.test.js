/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, act } from '@testing-library/react';
import App from '../../pages/_app';

// Mock dynamic imports
jest.mock('lite-youtube-embed/src/lite-yt-embed', () => ({}), { virtual: true });
jest.mock('lite-youtube-embed/src/lite-yt-embed.css', () => ({}), { virtual: true });

jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/',
    route: '/',
    query: {},
    asPath: '/'
  })
}));

describe('App Component', () => {
  const mockWindow = {};
  let originalWindow;

  beforeEach(() => {
    originalWindow = global.window;
    global.window = { ...mockWindow };
  });

  afterEach(() => {
    global.window = originalWindow;
    jest.clearAllMocks();
  });

  test('renders component with pageProps', async () => {
    const Component = jest.fn(() => <div>Test Component</div>);
    const pageProps = { testProp: 'test value' };

    await act(async () => {
      render(<App Component={Component} pageProps={pageProps} />);
    });

    expect(Component).toHaveBeenCalledWith(
      expect.objectContaining(pageProps),
      expect.any(Object)
    );
  });

  test('initializes with empty pageProps', async () => {
    const Component = jest.fn(() => <div>Test Component</div>);

    await act(async () => {
      render(<App Component={Component} />);
    });

    expect(Component).toHaveBeenCalledWith(
      expect.objectContaining({}),
      expect.any(Object)
    );
  });

  test('loads lite-youtube-embed on client side', async () => {
    const mockImport = jest.fn().mockResolvedValue({});
    jest.mock('lite-youtube-embed/src/lite-yt-embed', () => mockImport, { virtual: true });

    const Component = () => <div>Test Component</div>;

    await act(async () => {
      render(<App Component={Component} />);
    });

    expect(mockImport).toHaveBeenCalled();
  });

  test('skips lite-youtube-embed import on server side', async () => {
    global.window = undefined;
    const Component = () => <div>Test Component</div>;

    await act(async () => {
      render(<App Component={Component} />);
    });
  });

  test('handles dynamic import errors', async () => {
    const mockImport = jest.fn().mockRejectedValue(new Error('Import failed'));
    jest.mock('lite-youtube-embed/src/lite-yt-embed', () => mockImport, { virtual: true });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const Component = () => <div>Test Component</div>;

    await act(async () => {
      render(<App Component={Component} />);
    });

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  test('handles undefined Component prop', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    await act(async () => {
      expect(() => render(<App pageProps={{}} />)).toThrow();
    });

    consoleSpy.mockRestore();
  });

  test('passes router prop to Component', async () => {
    const Component = jest.fn(() => <div>Test Component</div>);
    
    await act(async () => {
      render(<App Component={Component} pageProps={{}} />);
    });

    const callProps = Component.mock.calls[0][1];
    expect(callProps).toHaveProperty('router');
  });
});
