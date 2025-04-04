import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from '../../components/Navbar';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href, className }) => {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  };
});

describe('Navbar Component', () => {
  const title = 'BikiNinjas Blog';
  
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
  
  test('renders without crashing when title prop is missing', () => {
    // Supprime les avertissements de la console pour ce test
    const consoleError = jest.spyOn(console, 'error');
    consoleError.mockImplementation(() => {});
    
    // Vérifie que le composant se rend sans planter même si le titre est manquant
    const { container } = render(<Navbar />);
    
    // Vérifie que le composant s'est rendu (même s'il est vide ou incomplet)
    expect(container).toBeTruthy();
    
    consoleError.mockRestore();
  });
});
