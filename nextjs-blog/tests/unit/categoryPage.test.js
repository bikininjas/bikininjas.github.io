import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CategoryPage, { getStaticProps, getStaticPaths } from '../../pages/categories/[category]';
import * as postsLib from '../../lib/posts';

// Mock des dépendances
jest.mock('next/link', () => {
  const MockLink = ({ children, href }) => {
    return <a href={href} data-testid="mock-link">{children}</a>;
  };
  
  MockLink.propTypes = {
    children: jest.requireActual('prop-types').node.isRequired,
    href: jest.requireActual('prop-types').string.isRequired
  };
  
  return MockLink;
});

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

describe('Category Page', () => {
  const mockCategorySlug = 'gaming';
  const mockCategory = 'Gaming';
  const mockCategories = ['Gaming', 'Tech', 'AI'];
  
  const mockPosts = [
    {
      id: 'post-1',
      title: 'Test Gaming Post 1',
      date: '2025-03-01',
      excerpt: 'This is a gaming post',
      category: 'Gaming',
      categorySlug: 'gaming'
    },
    {
      id: 'post-2',
      title: 'Test Gaming Post 2',
      date: '2025-03-02',
      excerpt: 'This is another gaming post',
      category: 'Gaming',
      categorySlug: 'gaming'
    }
  ];

  const mockCategorySlugs = ['gaming', 'tech', 'ai'];

  beforeEach(() => {
    // Mock des fonctions de lib/posts
    jest.spyOn(postsLib, 'getAllCategorySlugs').mockReturnValue(mockCategorySlugs);
    jest.spyOn(postsLib, 'getCategoryFromSlug').mockReturnValue(mockCategory);
    jest.spyOn(postsLib, 'getPostsByCategorySlug').mockReturnValue(mockPosts);
    jest.spyOn(postsLib, 'getAllCategories').mockReturnValue(mockCategories);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('getStaticPaths returns the correct paths', async () => {
    const result = await getStaticPaths();
    
    expect(result).toEqual({
      paths: [
        { params: { category: 'gaming' } },
        { params: { category: 'tech' } },
        { params: { category: 'ai' } }
      ],
      fallback: false
    });
    
    expect(postsLib.getAllCategorySlugs).toHaveBeenCalledTimes(1);
  });

  test('getStaticProps returns the correct data', async () => {
    const params = { category: mockCategorySlug };
    const result = await getStaticProps({ params });
    
    expect(result).toEqual({
      props: {
        category: mockCategory,
        categorySlug: mockCategorySlug,
        postsData: mockPosts,
        categories: mockCategories
      }
    });
    
    expect(postsLib.getCategoryFromSlug).toHaveBeenCalledWith(mockCategorySlug);
    expect(postsLib.getPostsByCategorySlug).toHaveBeenCalledWith(mockCategorySlug);
    expect(postsLib.getAllCategories).toHaveBeenCalledTimes(1);
  });

  test('renders the category page with posts', () => {
    render(
      <CategoryPage 
        category={mockCategory} 
        categorySlug={mockCategorySlug} 
        postsData={mockPosts} 
        categories={mockCategories} 
      />
    );
    
    // Vérifier que le layout est rendu avec le bon titre
    const layout = screen.getByTestId('mock-layout');
    expect(layout).toBeInTheDocument();
    expect(layout.dataset.title).toBe('Gaming - BikiNinjas Blog');
    
    // Vérifier que le composant CategoryNav est rendu avec les bonnes props
    const categoryNav = screen.getByTestId('mock-category-nav');
    expect(categoryNav).toBeInTheDocument();
    expect(categoryNav.dataset.currentCategory).toBe('Gaming');
    
    // Vérifier que le titre de la section est correct
    expect(screen.getByText('Posts in Gaming')).toBeInTheDocument();
    
    // Vérifier que les articles sont rendus
    expect(screen.getByText('Test Gaming Post 1')).toBeInTheDocument();
    expect(screen.getByText('Test Gaming Post 2')).toBeInTheDocument();
    expect(screen.getByText('2025-03-01')).toBeInTheDocument();
    expect(screen.getByText('2025-03-02')).toBeInTheDocument();
    expect(screen.getByText('This is a gaming post')).toBeInTheDocument();
    expect(screen.getByText('This is another gaming post')).toBeInTheDocument();
    
    // Vérifier que les liens sont corrects
    const links = screen.getAllByTestId('mock-link');
    expect(links[0].getAttribute('href')).toBe('/posts/post-1');
    expect(links[1].getAttribute('href')).toBe('/posts/post-2');
  });

  test('renders the category page with no posts', () => {
    render(
      <CategoryPage 
        category={mockCategory} 
        categorySlug={mockCategorySlug} 
        postsData={[]} 
        categories={mockCategories} 
      />
    );
    
    // Vérifier que le message "No posts found" est affiché
    expect(screen.getByText('No posts found in this category.')).toBeInTheDocument();
    
    // Vérifier que le lien de retour est présent
    const backLink = screen.getByText('← Back to all posts');
    expect(backLink).toBeInTheDocument();
    expect(backLink.closest('a')).toHaveAttribute('href', '/');
  });
});
