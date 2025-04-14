import React from 'react';
import { render } from '@testing-library/react';
import Document, { Html, Head, Main, NextScript } from '../../pages/_document';

jest.mock('next/document', () => ({
  __esModule: true,
  default: () => null,
  Html: ({ children, lang }) => <html lang={lang}>{children}</html>,
  Head: () => <head data-testid="document-head" />,
  Main: () => <main data-testid="document-main" />,
  NextScript: () => <script data-testid="next-script" />
}));

describe('Document Component', () => {
  test('getInitialProps returns expected props', async () => {
    const mockEnhancer = jest.fn((App) => App);
    const ctx = {
      renderPage: jest.fn(() => ({
        html: '<div>Test</div>',
        head: [<title key="title">Test</title>],
        styles: [<style key="style">{`body { margin: 0; }`}</style>]
      })),
      defaultGetInitialProps: mockEnhancer
    };

    const initialProps = await Document.getInitialProps(ctx);
    
    expect(initialProps).toHaveProperty('html');
    expect(initialProps).toHaveProperty('head');
    expect(initialProps).toHaveProperty('styles');
    expect(ctx.renderPage).toHaveBeenCalled();
  });

  test('renders document structure with lang attribute', () => {
    const { container } = render(
      <Html lang="fr">
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );

    expect(container.firstChild).toHaveAttribute('lang', 'fr');
  });

  test('renders all required meta tags', () => {
    const { container } = render(
      <Html>
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="BikiNinjas Blog" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );

    const metaTags = container.querySelectorAll('meta');
    expect(metaTags).toHaveLength(3);
    expect(metaTags[0]).toHaveAttribute('charSet', 'utf-8');
    expect(metaTags[1]).toHaveAttribute('name', 'viewport');
    expect(metaTags[2]).toHaveAttribute('name', 'description');
  });

  test('handles renderPage errors', async () => {
    const ctx = {
      renderPage: jest.fn(() => {
        throw new Error('Render error');
      })
    };

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await expect(Document.getInitialProps(ctx)).rejects.toThrow('Render error');
    consoleSpy.mockRestore();
  });

  test('renders custom scripts', () => {
    const { container } = render(
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
          <script dangerouslySetInnerHTML={{
            __html: 'console.log("Custom script")'
          }} />
        </body>
      </Html>
    );

    const scripts = container.querySelectorAll('script');
    expect(scripts.length).toBeGreaterThan(0);
  });

  test('renders with custom body attributes', () => {
    const { container } = render(
      <Html>
        <Head />
        <body className="custom-class" data-theme="dark">
          <Main />
          <NextScript />
        </body>
      </Html>
    );

    const body = container.querySelector('body');
    expect(body).toHaveAttribute('class', 'custom-class');
    expect(body).toHaveAttribute('data-theme', 'dark');
  });

  test('renders critical CSS', () => {
    const { container } = render(
      <Html>
        <Head>
          <style data-critical="true">{`
            body { margin: 0; padding: 0; }
          `}</style>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );

    const style = container.querySelector('style[data-critical="true"]');
    expect(style).toBeInTheDocument();
  });
});
