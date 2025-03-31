import { render, screen } from '@testing-library/react';
import Layout from '../../components/layout';

// Mock des composants Next.js
jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }) => <div data-testid="mock-head">{children}</div>,
  };
});

// Mock du composant Navbar
jest.mock('../../components/Navbar', () => {
  return {
    __esModule: true,
    default: ({ title }) => <nav data-testid="mock-navbar">{title}</nav>,
  };
});

jest.mock('next/link', () => {
  return {
    __esModule: true,
    default: ({ children, href }) => <a href={href} data-testid="mock-link">{children}</a>,
  };
});

describe('Layout Component', () => {
  test('renders layout with children', () => {
    render(
      <Layout home>
        <div data-testid="test-child">Test Content</div>
      </Layout>
    );

    // Vérifier que le contenu enfant est rendu
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    
    // Vérifier que la navbar est présente
    expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();
    
    // Vérifier que le footer est présent
    expect(screen.getByText(/BikiNinjas/)).toBeInTheDocument();
  });

  test('renders with custom title', () => {
    render(
      <Layout title="Test Title">
        <div>Test Content</div>
      </Layout>
    );

    // Vérifier que le titre est passé au Head (via data-testid="mock-head")
    const head = screen.getByTestId('mock-head');
    expect(head).toBeInTheDocument();
    expect(head).toHaveTextContent('Test Title');
  });
});
