/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react';

// Mock Next.js document components
jest.mock('next/document', () => ({
  Html: ({ children, lang }) => <html lang={lang}>{children}</html>,
  Head: ({ children }) => <head>{children}</head>,
  Main: () => <main />,
  NextScript: () => <script data-testid="next-script" />
}));

// Import after mocking
import Document from '../../pages/_document';

describe('Document Component', () => {
  test('renders document structure with lang attribute', () => {
    const { container } = render(<Document />);
    const htmlElement = container.querySelector('html');
    expect(htmlElement).toHaveAttribute('lang', 'en');
  });

  test('renders head component', () => {
    const { container } = render(<Document />);
    const headElement = container.querySelector('head');
    expect(headElement).toBeInTheDocument();
  });

  test('renders main and nextscript components', () => {
    const { container, getByTestId } = render(<Document />);
    
    expect(container.querySelector('main')).toBeInTheDocument();
    expect(getByTestId('next-script')).toBeInTheDocument();
  });
});
