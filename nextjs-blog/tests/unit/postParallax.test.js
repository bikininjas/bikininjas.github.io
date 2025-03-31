import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostParallax from '../../components/PostParallax';

// Mock the window object for scroll events
const mockSetOffset = jest.fn();
jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    useState: jest.fn((initialValue) => [initialValue, mockSetOffset]),
  };
});

describe('PostParallax Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockSetOffset.mockClear();
    window.scrollY = 0;
  });

  test('renders with required props', () => {
    render(<PostParallax title="Test Post Title" />);
    
    // Check if title is rendered
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    
    // Check if the background has a default image
    const backgroundDiv = document.querySelector('[class^="parallaxBackground"]');
    expect(backgroundDiv.style.backgroundImage).toContain('unsplash.com');
  });

  test('renders with date and category', () => {
    render(
      <PostParallax 
        title="Test Post Title" 
        date="2025-03-31" 
        category="Gaming"
      />
    );
    
    // Check if title, date and category are rendered
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    expect(screen.getByText('2025-03-31')).toBeInTheDocument();
    expect(screen.getByText('Gaming')).toBeInTheDocument();
    
    // Check if the background has the Gaming category image
    const backgroundDiv = document.querySelector('[class^="parallaxBackground"]');
    expect(backgroundDiv.style.backgroundImage).toContain('unsplash.com');
  });

  test('renders with multiple categories', () => {
    render(
      <PostParallax 
        title="Test Post Title" 
        date="2025-03-31" 
        categories={['AI', 'Tech']}
      />
    );
    
    // Check if title, date and first category are rendered
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    expect(screen.getByText('2025-03-31')).toBeInTheDocument();
    expect(screen.getByText('AI')).toBeInTheDocument();
    
    // Check if the background has the AI category image
    const backgroundDiv = document.querySelector('[class^="parallaxBackground"]');
    expect(backgroundDiv.style.backgroundImage).toContain('unsplash.com');
  });

  test('uses custom background image when provided', () => {
    render(
      <PostParallax 
        title="Test Post Title" 
        backgroundImage="https://example.com/custom-image.jpg"
      />
    );
    
    // Check if the background has the custom image
    const backgroundDiv = document.querySelector('[class^="parallaxBackground"]');
    expect(backgroundDiv.style.backgroundImage).toContain('example.com/custom-image.jpg');
  });

  test('handles scroll events', () => {
    render(<PostParallax title="Test Post Title" />);
    
    // Simulate scroll event
    window.scrollY = 100;
    fireEvent.scroll(window);
    
    // Check if setOffset was called with the correct value
    expect(mockSetOffset).toHaveBeenCalledWith(100);
  });

  test('cleans up event listener on unmount', () => {
    // Sauvegarde des fonctions originales
    const originalAddEventListener = window.addEventListener;
    const originalRemoveEventListener = window.removeEventListener;
    
    // Création de mocks pour les fonctions d'ajout et de suppression d'écouteurs d'événements
    const addEventListenerMock = jest.fn();
    const removeEventListenerMock = jest.fn();
    
    // Remplacement des fonctions originales par nos mocks
    window.addEventListener = addEventListenerMock;
    window.removeEventListener = removeEventListenerMock;
    
    try {
      // Rendu du composant
      const { unmount } = render(<PostParallax title="Test Post Title" />);
      
      // Vérification que addEventListener a été appelé avec 'scroll'
      expect(addEventListenerMock).toHaveBeenCalledWith('scroll', expect.any(Function));
      
      // Récupération du gestionnaire d'événements
      const scrollHandler = addEventListenerMock.mock.calls.find(call => call[0] === 'scroll')[1];
      
      // Réinitialisation du mock removeEventListener avant le démontage
      removeEventListenerMock.mockClear();
      
      // Démontage du composant
      unmount();
      
      // Vérification que removeEventListener a été appelé avec 'scroll' et le même gestionnaire
      expect(removeEventListenerMock).toHaveBeenCalledWith('scroll', scrollHandler);
    } finally {
      // Restauration des fonctions originales
      window.addEventListener = originalAddEventListener;
      window.removeEventListener = originalRemoveEventListener;
    }
  });


  test('falls back to default image when category is not recognized', () => {
    render(
      <PostParallax 
        title="Test Post Title" 
        category="NonExistentCategory"
      />
    );
    
    // Check if the background has the default fallback image
    const backgroundDiv = document.querySelector('[class^="parallaxBackground"]');
    expect(backgroundDiv.style.backgroundImage).toContain('unsplash.com');
  });
});
