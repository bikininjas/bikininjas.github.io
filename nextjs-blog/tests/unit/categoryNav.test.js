import React from 'react';
import { render, screen } from '@testing-library/react';
import CategoryNav from '../../components/CategoryNav';
import { slugify } from '../../lib/utils';

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

describe('CategoryNav Component', () => {
  const categories = ['React', 'Next.js', 'JavaScript'];
  
  test('renders all categories correctly', () => {
    render(<CategoryNav categories={categories} />);
    
    // Vérifier que le titre est présent
    expect(screen.getByText('Catégories')).toBeInTheDocument();
    
    // Vérifier que "Tous les Articles" est présent
    expect(screen.getByText('Tous les Articles')).toBeInTheDocument();
    
    // Vérifier que toutes les catégories sont présentes
    categories.forEach(category => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });
  
  test('marks current category as active', () => {
    const currentCategory = 'React';
    render(<CategoryNav categories={categories} currentCategory={currentCategory} />);
    
    // Obtenir tous les éléments de liste
    const listItems = screen.getAllByRole('listitem');
    
    // Trouver l'élément actif
    const activeItem = listItems.find(item => item.className.includes('active'));
    
    // Vérifier que l'élément actif contient le texte de la catégorie actuelle
    expect(activeItem).toContainHTML(currentCategory);
  });
  
  test('marks "all" as active when currentCategory is "all"', () => {
    render(<CategoryNav categories={categories} currentCategory="all" />);
    
    // Obtenir tous les éléments de liste
    const listItems = screen.getAllByRole('listitem');
    
    // Trouver l'élément actif
    const activeItem = listItems.find(item => item.className.includes('active'));
    
    // Vérifier que l'élément actif contient "Tous les Articles"
    expect(activeItem).toContainHTML('Tous les Articles');
  });
  
  test('uses correct links for categories', () => {
    render(<CategoryNav categories={categories} />);
    
    // Vérifier que le lien "Tous les Articles" pointe vers "/"
    const homeLink = screen.getByText('Tous les Articles').closest('a');
    expect(homeLink).toHaveAttribute('href', '/');
    
    // Vérifier que les liens des catégories pointent vers les bonnes URLs
    categories.forEach(category => {
      const categoryLink = screen.getByText(category).closest('a');
      expect(categoryLink).toHaveAttribute('href', `/categories/${slugify(category)}`);
    });
  });
});
