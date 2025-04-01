import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import MyDocument from '../../pages/_document';

// Mock next/document components
jest.mock('next/document', () => {
  const originalModule = jest.requireActual('next/document');
  return {
    __esModule: true,
    ...originalModule,
    Html: ({ children, lang }) => (
      <html lang={lang}>
        {children}
      </html>
    ),
    Head: () => (
      <head>
        <meta charSet="utf-8" />
      </head>
    ),
    Main: () => <main data-testid="document-main" />,
    NextScript: () => <script data-testid="document-nextscript" />
  };
});

describe('MyDocument Component', () => {
  test('renders document structure correctly', () => {
    // Créer une instance du document
    const documentInstance = new MyDocument();
    
    // Mock les props et le contexte que Next.js passerait normalement
    documentInstance.props = {
      htmlProps: {},
      headTags: [],
      bodyTags: [],
      styles: []
    };
    
    // Mock le contexte
    documentInstance.context = {
      styles: []
    };
    
    // Appeler la méthode render
    const documentJSX = documentInstance.render();
    
    // Rendre le JSX
    const { getByTestId } = render(documentJSX);
    
    // Vérifier que les composants principaux sont présents
    expect(getByTestId('document-main')).toBeInTheDocument();
    expect(getByTestId('document-nextscript')).toBeInTheDocument();
    
    // Vérifier que l'attribut lang est défini sur "fr"
    const htmlElement = document.querySelector('html');
    expect(htmlElement).toHaveAttribute('lang', 'fr');
    
    // Vérifier que la balise meta charset est présente
    const metaElement = document.querySelector('meta[charset="utf-8"]');
    expect(metaElement).toBeInTheDocument();
  });
});
