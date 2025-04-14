import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CategoryPage, { getStaticProps, getStaticPaths } from '../../pages/categories/[category]';
import * as postsLib from '../../lib/posts';

jest.mock('../../lib/posts', () => ({
  getAllCategories: jest.fn(),
  getAllCategorySlugs: jest.fn(),
  getCategoryFromSlug: jest.fn(),
  getPostsByCategorySlug: jest.fn()
}));

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
  return function MockLayout({ children }) {
    return <div data-testid="mock-layout">{children}</div>;
  };
});

jest.mock('../../components/CategoryNav', () => {
  return function MockCategoryNav({ categories, currentCategory }) {
    return (
      <div data-testid="mock-category-nav">
        <span>Current: {currentCategory}</span>
        <span>Categories: {categories.join(', ')}</span>
      </div>
    );
  };
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

  test('renders category page with posts', () => {
    render(
      <CategoryPage 
        category={mockCategory}
        categorySlug={mockCategorySlug}
        postsData={mockPosts}
        categories={mockCategories}
      />
    );

    expect(screen.getByTestId('mock-layout')).toBeInTheDocument();
    expect(screen.getByTestId('mock-category-nav')).toBeInTheDocument();
    expect(screen.getByText(`Posts in ${mockCategory}`)).toBeInTheDocument();
    mockPosts.forEach(post => {
      expect(screen.getByText(post.title)).toBeInTheDocument();
    });
  });

  test('getStaticPaths returns all category slugs', async () => {
    const mockCategorySlugs = ['gaming', 'tech', 'ai'];
    postsLib.getAllCategories.mockResolvedValue(['Gaming', 'Tech', 'AI']);

    const { paths, fallback } = await getStaticPaths();
    
    expect(paths).toEqual(mockCategorySlugs.map(slug => ({ params: { category: slug } })));
    expect(fallback).toBe(false);
  });

  test('getStaticProps returns category data', async () => {
    const context = { params: { category: mockCategorySlug } };
    const { props } = await getStaticProps(context);
    
    expect(props).toEqual({
      category: mockCategory,
      categorySlug: mockCategorySlug,
      postsData: mockPosts,
      categories: mockCategories
    });
    
    expect(postsLib.getCategoryFromSlug).toHaveBeenCalledWith(mockCategorySlug);
    expect(postsLib.getPostsByCategorySlug).toHaveBeenCalledWith(mockCategorySlug);
    expect(postsLib.getAllCategories).toHaveBeenCalled();
  });

  test('renders empty state when no posts', () => {
    render(
      <CategoryPage 
        category={mockCategory}
        categorySlug={mockCategorySlug}
        postsData={[]}
        categories={mockCategories}
      />
    );
    
    expect(screen.getByText('No posts found in this category.')).toBeInTheDocument();
    expect(screen.getByText('← Back to all posts')).toBeInTheDocument();
  });

  test('handles missing props', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => render(
      <CategoryPage 
        categories={mockCategories}
        postsData={mockPosts}
      />
    )).toThrow();
    
    consoleSpy.mockRestore();
  });

  const mockProps = {
    category: 'Technology',
    categorySlug: 'technology',
    categories: ['Technology', 'Gaming', 'Development'],
    postsData: [
      {
        id: 'post-1',
        title: 'Tech Post 1',
        date: '2023-01-01',
        excerpt: 'First tech post',
        category: 'Technology'
      },
      {
        id: 'post-2',
        title: 'Tech Post 2',
        date: '2023-01-02',
        excerpt: 'Second tech post',
        category: 'Technology'
      }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders category page with posts', () => {
    render(<CategoryPage {...mockProps} />);
    
    expect(screen.getByTestId('mock-layout')).toBeInTheDocument();
    expect(screen.getByTestId('mock-category-nav')).toBeInTheDocument();
    expect(screen.getByText('Posts in Technology')).toBeInTheDocument();
    
    mockProps.postsData.forEach(post => {
      expect(screen.getByText(post.title)).toBeInTheDocument();
      expect(screen.getByText(post.excerpt)).toBeInTheDocument();
    });
  });

  test('getStaticPaths returns all category paths', async () => {
    const mockSlugs = ['technology', 'gaming'];
    postsLib.getAllCategorySlugs.mockResolvedValue(mockSlugs);

    const { paths, fallback } = await getStaticPaths();
    
    expect(paths).toEqual([
      { params: { category: 'technology' } },
      { params: { category: 'gaming' } }
    ]);
    expect(fallback).toBe(false);
  });

  test('getStaticProps returns category data', async () => {
    postsLib.getCategoryFromSlug.mockReturnValue('Technology');
    postsLib.getPostsByCategorySlug.mockReturnValue(mockProps.postsData);
    postsLib.getAllCategories.mockReturnValue(mockProps.categories);

    const context = { params: { category: 'technology' } };
    const { props } = await getStaticProps(context);
    
    expect(props).toEqual({
      category: 'Technology',
      categorySlug: 'technology',
      postsData: mockProps.postsData,
      categories: mockProps.categories
    });
  });

  test('renders empty state when no posts', () => {
    const propsWithNoPosts = {
      ...mockProps,
      postsData: []
    };
    
    render(<CategoryPage {...propsWithNoPosts} />);
    expect(screen.getByText('No posts found in this category.')).toBeInTheDocument();
  });

  test('navigates back to home when no posts', () => {
    const propsWithNoPosts = {
      ...mockProps,
      postsData: []
    };
    
    render(<CategoryPage {...propsWithNoPosts} />);
    const backLink = screen.getByText('← Back to all posts');
    expect(backLink).toHaveAttribute('href', '/');
  });

  test('handles invalid category slug', async () => {
    postsLib.getCategoryFromSlug.mockReturnValue(null);
    postsLib.getPostsByCategorySlug.mockReturnValue([]);
    postsLib.getAllCategories.mockReturnValue(mockProps.categories);

    const context = { params: { category: 'invalid' } };
    const { props } = await getStaticProps(context);
    
    expect(props.category).toBeNull();
    expect(props.postsData).toEqual([]);
  });

  test('throws error when required props are missing', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<CategoryPage />)).toThrow();
    consoleSpy.mockRestore();
  });
});
