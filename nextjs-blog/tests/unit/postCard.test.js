import React from 'react';
import { render, screen } from '@testing-library/react';
import PostCard from '../../components/PostCard';

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
});
