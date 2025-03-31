import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from '../../components/Navbar';

// Mock next/link
jest.mock('next/link', () => {
  const MockLink = ({ children, href, className }) => {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  };
  
  MockLink.propTypes = {
    children: PropTypes.node.isRequired,
    href: PropTypes.string.isRequired,
    className: PropTypes.string
  };
  
  return MockLink;
});

describe('Navbar Component', () => {
  const title = 'Test Blog';
  
  test('renders the navbar with correct title', () => {
    render(<Navbar title={title} />);
    
    // Vérifier que le titre est présent
    expect(screen.getByText(title)).toBeInTheDocument();
  });
  
  test('renders all navigation links', () => {
    render(<Navbar title={title} />);
    
    // Vérifier que tous les liens de navigation sont présents
    expect(screen.getByText('Accueil')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
  });
  
  test('has correct href attributes for links', () => {
    render(<Navbar title={title} />);
    
    // Vérifier les attributs href des liens
    const homeLink = screen.getByText('Accueil').closest('a');
    expect(homeLink).toHaveAttribute('href', '/');
    
    const blogLink = screen.getByText('Blog').closest('a');
    expect(blogLink).toHaveAttribute('href', '/posts/unreal-engine-beginners-guide');
    
    const githubLink = screen.getByText('GitHub').closest('a');
    expect(githubLink).toHaveAttribute('href', 'https://github.com/bikininjas/bikininjas.github.io');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
  
  test('warns when title prop is missing', () => {
    // Vérifier que le composant génère un avertissement lorsque le titre est manquant
    const consoleError = jest.spyOn(console, 'error');
    consoleError.mockImplementation(() => {});
    
    // React 18 ne lève pas toujours une exception pour les props manquantes
    // mais génère un avertissement dans la console
    render(<Navbar />);
    
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
