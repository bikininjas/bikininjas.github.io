import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Post, { getStaticProps, getStaticPaths } from '../../pages/posts/[id]';
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

jest.mock('../../components/PostContent', () => {
  const MockPostContent = ({ content }) => {
    return (
      <div className="PostContent_postContent__test" dangerouslySetInnerHTML={{ __html: content }} />
    );
  };
  
  MockPostContent.propTypes = {
    content: jest.requireActual('prop-types').string.isRequired
  };
  
  return MockPostContent;
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
    currentCategory: jest.requireActual('prop-types').string
  };
  
  return MockCategoryNav;
});

jest.mock('../../components/PostParallax', () => {
  const MockPostParallax = ({ title, date, category, categories, backgroundImage }) => {
    return (
      <div 
        data-testid="mock-post-parallax" 
        data-title={title} 
        data-date={date} 
        data-category={category}
        data-categories={categories ? categories.join(',') : ''}
        data-background-image={backgroundImage || ''}
      >
        Post Parallax Component
      </div>
    );
  };
  
  MockPostParallax.propTypes = {
    title: jest.requireActual('prop-types').string.isRequired,
    date: jest.requireActual('prop-types').string,
    category: jest.requireActual('prop-types').string,
    categories: jest.requireActual('prop-types').arrayOf(
      jest.requireActual('prop-types').string
    ),
    backgroundImage: jest.requireActual('prop-types').string
  };
  
  return MockPostParallax;
});

describe('Post Page', () => {
  
  const mockPostId = 'test-post';
  const mockCategories = ['Gaming', 'Tech', 'AI'];
  
  const mockPostData = {
    id: mockPostId,
    title: 'Test Post Title',
    date: '2025-03-31',
    contentHtml: '<p>Test content</p>',
    category: 'Gaming',
    categorySlug: 'gaming',
    categories: ['Gaming', 'Tech'],
    coverImage: 'https://example.com/image.jpg',
    author: 'Test Author'
  };

  const mockPostWithAuthorHtml = {
    ...mockPostData,
    authorHtml: '<p><strong>Written by:</strong> Test Author with HTML</p>'
  };

  const mockPaths = [
    { params: { id: 'test-post-1' } },
    { params: { id: 'test-post-2' } }
  ];

  beforeEach(() => {
    // Mock des fonctions de lib/posts
    jest.spyOn(postsLib, 'getAllPostIds').mockReturnValue(mockPaths);
    jest.spyOn(postsLib, 'getPostData').mockResolvedValue(mockPostData);
    jest.spyOn(postsLib, 'getAllCategories').mockReturnValue(mockCategories);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('getStaticPaths returns the correct paths', async () => {
    const result = await getStaticPaths();
    
    expect(result).toEqual({
      paths: mockPaths,
      fallback: false
    });
    
    expect(postsLib.getAllPostIds).toHaveBeenCalledTimes(1);
  });

  test('getStaticProps returns the correct data', async () => {
    const params = { id: mockPostId };
    const result = await getStaticProps({ params });
    
    expect(result).toEqual({
      props: {
        postData: mockPostData,
        categories: mockCategories
      }
    });
    
    expect(postsLib.getPostData).toHaveBeenCalledWith(mockPostId);
    expect(postsLib.getAllCategories).toHaveBeenCalledTimes(1);
  });

  test('renders the post page with all components', async () => {
    // Utiliser act pour gérer les effets React
    await act(async () => {
      render(
        <Post 
          postData={mockPostData} 
          categories={mockCategories} 
        />
      );
    });
    
    // Vérifier que le layout est rendu avec le bon titre
    const layout = screen.getByTestId('mock-layout');
    expect(layout).toBeInTheDocument();
    expect(layout.dataset.title).toBe('Test Post Title');
    
    // Vérifier que le composant PostParallax est rendu avec les bonnes props
    const postParallax = screen.getByTestId('mock-post-parallax');
    expect(postParallax).toBeInTheDocument();
    expect(postParallax.dataset.title).toBe('Test Post Title');
    expect(postParallax.dataset.date).toBe('2025-03-31');
    expect(postParallax.dataset.category).toBe('Gaming');
    expect(postParallax.dataset.categories).toBe('Gaming,Tech');
    expect(postParallax.dataset.backgroundImage).toBe('https://example.com/image.jpg');
    
    // Vérifier que le composant CategoryNav est rendu avec les bonnes props
    const categoryNav = screen.getByTestId('mock-category-nav');
    expect(categoryNav).toBeInTheDocument();
    expect(categoryNav.dataset.currentCategory).toBe('Gaming');
    
    // Vérifier que le lien de retour est présent
    const backLink = screen.getByText('← Back to all posts');
    expect(backLink).toBeInTheDocument();
    expect(backLink.closest('a')).toHaveAttribute('href', '/');
    
    // Vérifier que le contenu HTML est rendu
    const contentElement = document.querySelector('.PostContent_postContent__test');
    expect(contentElement).toBeInTheDocument();
    expect(contentElement.innerHTML).toBe(mockPostData.contentHtml);
    
    // Vérifier que les informations d'auteur sont rendues
    const authorFooter = document.querySelector('.author-footer');
    expect(authorFooter).toBeInTheDocument();
    expect(authorFooter.textContent).toContain('Written by:');
    expect(authorFooter.textContent).toContain('Test Author');
    
    // Vérifier que l'élément strong contenant "Written by:" existe
    const authorStrong = authorFooter.querySelector('strong');
    expect(authorStrong).toBeInTheDocument();
    expect(authorStrong.textContent).toBe('Written by:');
  });

  test('renders with authorHtml when provided', async () => {
    await act(async () => {
      render(
        <Post 
          postData={mockPostWithAuthorHtml} 
          categories={mockCategories} 
        />
      );
    });
    
    // Vérifier que le HTML de l'auteur personnalisé est utilisé
    const authorElement = document.querySelector('.author-footer .markdown');
    expect(authorElement).toBeInTheDocument();
    expect(authorElement.innerHTML).toBe(mockPostWithAuthorHtml.authorHtml);
  });
});
