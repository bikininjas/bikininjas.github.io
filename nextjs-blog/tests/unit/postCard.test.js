import React from 'react';
import { render, screen } from '@testing-library/react';
import PostCard from '../../components/PostCard';

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

// Mock CSS modules
jest.mock('../styles/Card.module.css', () => ({
  cardLink: 'cardLink',
  card: 'card',
  cardWithBg: 'cardWithBg',
  cardContent: 'cardContent',
  cardCategories: 'cardCategories',
  cardCategory: 'cardCategory',
  cardTitle: 'cardTitle',
  cardDate: 'cardDate',
  cardExcerpt: 'cardExcerpt',
  cardArrow: 'cardArrow'
}), { virtual: true });

describe('PostCard Component', () => {
  const mockPost = {
    id: 'test-post',
    date: '2025-01-01',
    title: 'Test Post Title',
    excerpt: 'This is a test excerpt for the post',
    categories: ['Développement de Jeux', 'Technologie'],
    coverImage: 'https://example.com/test-image.jpg'
  };
  
  test('renders post card with correct content', () => {
    render(<PostCard post={mockPost} />);
    
    // Vérifier que le titre, la date et l'extrait sont présents
    expect(screen.getByText(mockPost.title)).toBeInTheDocument();
    expect(screen.getByText(mockPost.date)).toBeInTheDocument();
    expect(screen.getByText(mockPost.excerpt)).toBeInTheDocument();
    
    // Vérifier que les catégories sont présentes
    mockPost.categories.forEach(category => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });
  
  test('links to the correct post URL', () => {
    render(<PostCard post={mockPost} />);
    
    // Vérifier que le lien pointe vers la bonne URL
    const link = screen.getByText(mockPost.title).closest('a');
    expect(link).toHaveAttribute('href', `/posts/${mockPost.id}`);
  });
  
  test('uses provided cover image when available', () => {
    render(<PostCard post={mockPost} />);
    
    // Vérifier que l'image de couverture est utilisée dans le style
    const article = screen.getByRole('article');
    expect(article.style.getPropertyValue('--bg-image')).toBe(`url(${mockPost.coverImage})`);
  });
  
  test('uses category default image when no cover image is provided', () => {
    const postWithoutCover = {
      ...mockPost,
      coverImage: undefined
    };
    
    render(<PostCard post={postWithoutCover} />);
    
    // Vérifier qu'une image par défaut basée sur la catégorie est utilisée
    const article = screen.getByRole('article');
    const bgImageValue = article.style.getPropertyValue('--bg-image');
    expect(bgImageValue).toContain('url(https://images.unsplash.com');
  });
  
  test('uses fallback image when no cover image or matching category image is available', () => {
    const postWithoutCoverOrMatchingCategory = {
      ...mockPost,
      coverImage: undefined,
      categories: ['NonExistentCategory']
    };
    
    render(<PostCard post={postWithoutCoverOrMatchingCategory} />);
    
    // Vérifier qu'une image par défaut est utilisée
    const article = screen.getByRole('article');
    const bgImageValue = article.style.getPropertyValue('--bg-image');
    expect(bgImageValue).toContain('url(https://images.unsplash.com');
  });

  test('uses fallback image when no cover image and no categories are provided', () => {
    const postWithoutCoverOrCategories = {
      ...mockPost,
      coverImage: undefined,
      categories: undefined
    };
    
    render(<PostCard post={postWithoutCoverOrCategories} />);
    
    // Vérifier qu'une image par défaut est utilisée
    const article = screen.getByRole('article');
    const bgImageValue = article.style.getPropertyValue('--bg-image');
    expect(bgImageValue).toContain('url(https://images.unsplash.com');
  });

  test('uses fallback image when no cover image and empty categories array', () => {
    const postWithoutCoverAndEmptyCategories = {
      ...mockPost,
      coverImage: undefined,
      categories: []
    };
    
    render(<PostCard post={postWithoutCoverAndEmptyCategories} />);
    
    // Vérifier qu'une image par défaut est utilisée
    const article = screen.getByRole('article');
    const bgImageValue = article.style.getPropertyValue('--bg-image');
    expect(bgImageValue).toContain('url(https://images.unsplash.com');
  });

  test('uses second category image when first category has no matching image', () => {
    const postWithMultipleCategories = {
      ...mockPost,
      coverImage: undefined,
      categories: ['NonExistentCategory', 'Tech']
    };
    
    render(<PostCard post={postWithMultipleCategories} />);
    
    // Vérifier qu'une image basée sur la deuxième catégorie est utilisée
    const article = screen.getByRole('article');
    const bgImageValue = article.style.getPropertyValue('--bg-image');
    expect(bgImageValue).toContain('url(https://images.unsplash.com');
    
    // Vérifier que les deux catégories sont affichées
    expect(screen.getByText('NonExistentCategory')).toBeInTheDocument();
    expect(screen.getByText('Tech')).toBeInTheDocument();
  });

  test('limits displayed categories to two even if more are provided', () => {
    const postWithManyCategories = {
      ...mockPost,
      categories: ['Tech', 'AI', 'Gaming']
    };
    
    render(<PostCard post={postWithManyCategories} />);
    
    // Vérifier que seules les deux premières catégories sont affichées
    expect(screen.getByText('Tech')).toBeInTheDocument();
    expect(screen.getByText('AI')).toBeInTheDocument();
    expect(screen.queryByText('Gaming')).not.toBeInTheDocument();
  });

  test('does not display categories section when no categories are provided', () => {
    const postWithoutCategories = {
      ...mockPost,
      categories: undefined
    };
    
    render(<PostCard post={postWithoutCategories} />);
    
    // Vérifier qu'aucune section de catégories n'est affichée
    const categoriesDiv = document.querySelector('.cardCategories');
    expect(categoriesDiv).toBeNull();
  });

  test('does not display categories section when empty categories array is provided', () => {
    const postWithEmptyCategories = {
      ...mockPost,
      categories: []
    };
    
    render(<PostCard post={postWithEmptyCategories} />);
    
    // Vérifier qu'aucune section de catégories n'est affichée
    const categoriesDiv = document.querySelector('.cardCategories');
    expect(categoriesDiv).toBeNull();
  });

  test('displays excerpt when provided', () => {
    render(<PostCard post={mockPost} />);
    
    // Vérifier que l'extrait est affiché
    expect(screen.getByText(mockPost.excerpt)).toBeInTheDocument();
  });

  test('handles post without excerpt', () => {
    const postWithoutExcerpt = {
      ...mockPost,
      excerpt: undefined
    };
    
    // Vérifier que le rendu ne génère pas d'erreur sans extrait
    expect(() => render(<PostCard post={postWithoutExcerpt} />)).not.toThrow();
  });
});
