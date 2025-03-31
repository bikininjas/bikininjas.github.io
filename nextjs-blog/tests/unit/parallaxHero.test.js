import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ParallaxHero from '../../components/ParallaxHero';

// Mock de useState pour pouvoir tester les mises à jour d'état
const mockSetOffset = jest.fn();
jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    useState: jest.fn((initialValue) => [initialValue, mockSetOffset]),
  };
});

describe('ParallaxHero Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockSetOffset.mockClear();
    window.scrollY = 0;
  });

  test('renders with default props', () => {
    render(<ParallaxHero />);
    
    // Check if default title and subtitle are rendered
    expect(screen.getByText('BikiNinjas')).toBeInTheDocument();
    expect(screen.getByText('Gaming, Development & Digital Wellbeing')).toBeInTheDocument();
    
    // Check if the background has the default image
    const backgroundDiv = document.querySelector('[class^="parallaxBackground"]');
    expect(backgroundDiv.style.backgroundImage).toContain('unsplash.com');
  });

  test('renders with custom props', () => {
    const customProps = {
      title: 'Custom Title',
      subtitle: 'Custom Subtitle',
      backgroundImage: 'https://example.com/image.jpg'
    };
    
    render(<ParallaxHero {...customProps} />);
    
    // Check if custom title and subtitle are rendered
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom Subtitle')).toBeInTheDocument();
    
    // Check if the background has the custom image
    const backgroundDiv = document.querySelector('[class^="parallaxBackground"]');
    expect(backgroundDiv.style.backgroundImage).toContain('example.com/image.jpg');
  });

  test('handles scroll events', () => {
    render(<ParallaxHero />);
    
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
      const { unmount } = render(<ParallaxHero />);
      
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

});
