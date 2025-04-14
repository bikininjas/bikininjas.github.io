/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react';
import Document from '../../pages/_document';
import { Html, Head, Main, NextScript } from 'next/document';

// Mock next/document components
jest.spyOn(React, 'createElement').mockImplementation((type, props, ...children) => {
  if (type === Html) {
    return <html lang={props?.lang} data-testid="html" {...props}>{children}</html>;
  }
  if (type === Head) {
    return <head data-testid="head" {...props}>{children}</head>;
  }
  if (type === Main) {
    return <main data-testid="main" {...props} />;
  }
  if (type === NextScript) {
    return <script data-testid="next-script" {...props} />;
  }
  return React.createElement.wrappedMethod(type, props, ...children);
});

describe('Document Component', () => {
  beforeAll(() => {
    // Mock Document.getInitialProps which is normally provided by Next.js
    Document.getInitialProps = jest.fn().mockResolvedValue({
      html: '<div>Test</div>',
      head: [],
      styles: []
    });
  });

  test('renders document structure with lang attribute', () => {
    const { getByTestId } = render(
      <Html lang="fr">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );

    expect(getByTestId('html')).toHaveAttribute('lang', 'fr');
  });

  test('renders head component', () => {
    const { getByTestId } = render(
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );

    expect(getByTestId('head')).toBeInTheDocument();
  });

  test('renders main and nextscript components', () => {
    const { getByTestId } = render(
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );

    expect(getByTestId('main')).toBeInTheDocument();
    expect(getByTestId('next-script')).toBeInTheDocument();
  });
});
