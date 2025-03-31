import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home, { getStaticProps } from '../../pages/index';
import * as postsLib from '../../lib/posts';

// Mock des dépendances
jest.mock('../../components/layout', () => {
  const MockLayout = ({ children, title }) => {
    return (
      <div data-testid="mock-layout" data-title={title}>
        {children}
      </div>
    );
  };
  
  MockLayout.propTypes = {
    children: jest.requireActual('prop-types').node.isRequired,
    title: jest.requireActual('prop-types').string
  };
  
  return MockLayout;
});

jest.mock('../../components/ParallaxHero', () => {
  const MockParallaxHero = ({ title, subtitle }) => {
    return (
      <div data-testid="mock-parallax" data-title={title} data-subtitle={subtitle}>
        Parallax Hero Component
      </div>
    );
  };
  
  MockParallaxHero.propTypes = {
    title: jest.requireActual('prop-types').string,
    subtitle: jest.requireActual('prop-types').string
  };
  
  return MockParallaxHero;
});

jest.mock('../../components/CategoryNav', () => {
  const MockCategoryNav = ({ categories, currentCategory }) => {
    return (
      <div data-testid="mock-category-nav" data-current-category={currentCategory}>
        {categories.join(', ')}
      </div>
    );
  };
  
  MockCategoryNav.propTypes = {
    categories: jest.requireActual('prop-types').arrayOf(
      jest.requireActual('prop-types').string
    ).isRequired,
    currentCategory: jest.requireActual('prop-types').string.isRequired
  };
  
  return MockCategoryNav;
});

jest.mock('../../components/PostCard', () => {
  const MockPostCard = ({ post }) => {
    return (
      <div data-testid="mock-post-card" data-post-id={post.id}>
        {post.title}
      </div>
    );
  };
  
  MockPostCard.propTypes = {
    post: jest.requireActual('prop-types').shape({
      id: jest.requireActual('prop-types').string.isRequired,
      title: jest.requireActual('prop-types').string.isRequired
    }).isRequired
  };
  
  return MockPostCard;
});

describe('Home Page', () => {
  const mockPosts = [
    {
      id: 'post-1',
      title: 'Test Post 1',
      date: '2025-03-01',
      excerpt: 'This is test post 1',
      category: 'Gaming'
    },
    {
      id: 'post-2',
      title: 'Test Post 2',
      date: '2025-03-02',
      excerpt: 'This is test post 2',
      category: 'Tech'
    }
  ];
  
  const mockCategories = ['Gaming', 'Tech', 'AI'];

  beforeEach(() => {
    // Mock des fonctions de lib/posts
    jest.spyOn(postsLib, 'getSortedPostsData').mockReturnValue(mockPosts);
    jest.spyOn(postsLib, 'getAllCategories').mockReturnValue(mockCategories);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('getStaticProps returns the correct data', async () => {
    const result = await getStaticProps();
    
    expect(result).toEqual({
      props: {
        allPostsData: mockPosts,
        categories: mockCategories
      }
    });
    
    expect(postsLib.getSortedPostsData).toHaveBeenCalledTimes(1);
    expect(postsLib.getAllCategories).toHaveBeenCalledTimes(1);
  });

  test('renders the home page with all components', () => {
    render(<Home allPostsData={mockPosts} categories={mockCategories} />);
    
    // Vérifier que le layout est rendu avec le bon titre
    const layout = screen.getByTestId('mock-layout');
    expect(layout).toBeInTheDocument();
    expect(layout.dataset.title).toBe('BikiNinjas - Accueil');
    
    // Vérifier que le composant ParallaxHero est rendu avec les bonnes props
    const parallax = screen.getByTestId('mock-parallax');
    expect(parallax).toBeInTheDocument();
    expect(parallax.dataset.title).toBe('BikiNinjas');
    expect(parallax.dataset.subtitle).toBe('Jeux Vidéo, Développement & Bien-être Numérique');
    
    // Vérifier que le composant CategoryNav est rendu avec les bonnes props
    const categoryNav = screen.getByTestId('mock-category-nav');
    expect(categoryNav).toBeInTheDocument();
    expect(categoryNav.dataset.currentCategory).toBe('all');
    expect(categoryNav.textContent).toBe('Gaming, Tech, AI');
    
    // Vérifier que les PostCards sont rendus pour chaque article
    const postCards = screen.getAllByTestId('mock-post-card');
    expect(postCards).toHaveLength(2);
    expect(postCards[0].dataset.postId).toBe('post-1');
    expect(postCards[0].textContent).toBe('Test Post 1');
    expect(postCards[1].dataset.postId).toBe('post-2');
    expect(postCards[1].textContent).toBe('Test Post 2');
    
    // Vérifier que le titre de section est présent
    expect(screen.getByText('Derniers Articles')).toBeInTheDocument();
  });
});
