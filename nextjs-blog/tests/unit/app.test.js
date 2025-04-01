import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import MyApp from '../../pages/_app';

// Mock des modules dynamiques
jest.mock('lite-youtube-embed/src/lite-yt-embed', () => ({}), { virtual: true });
jest.mock('lite-youtube-embed/src/lite-yt-embed.css', () => ({}), { virtual: true });

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn((fn) => {
    // Simuler l'exécution du callback
    fn();
    // Retourner une fonction de nettoyage vide
    return () => {};
  }),
}));

const mockUseEffect = require('react').useEffect;

describe('MyApp Component', () => {
  let originalWindow;

  beforeEach(() => {
    // Sauvegarde de la valeur originale de window
    originalWindow = global.window;
  });

  afterEach(() => {
    // Restauration de window
    global.window = originalWindow;
    jest.clearAllMocks();
  });

  it('renders the component with pageProps', () => {
    // Mock Component that would be passed to MyApp
    const MockComponent = jest.fn(({ testProp }) => (
      <div data-testid="mock-component" data-test-prop={testProp}>
        Test Component
      </div>
    ));
    
    // Mock pageProps
    const pageProps = { testProp: 'test-value' };
    
    // Render MyApp with the mocked Component and pageProps
    const { getByTestId } = render(
      <MyApp Component={MockComponent} pageProps={pageProps} />
    );
    
    // Check if the Component was rendered with the correct props
    const renderedComponent = getByTestId('mock-component');
    expect(renderedComponent).toBeInTheDocument();
    expect(renderedComponent).toHaveAttribute('data-test-prop', 'test-value');
    expect(renderedComponent).toHaveTextContent('Test Component');
    
    // Check if the Component was called
    expect(MockComponent).toHaveBeenCalled();
    
    // Vérifier que le premier argument contient les pageProps
    const firstArg = MockComponent.mock.calls[0][0];
    expect(firstArg).toEqual(expect.objectContaining(pageProps));
  });

  // it('imports lite-youtube-embed only on client side', () => {
  //   // Mock de window pour simuler l'environnement navigateur
  //   global.window = {};
    
  //   // Mock des imports dynamiques
  //   const mockImport = jest.fn().mockResolvedValue({});
  //   jest.mock('lite-youtube-embed/src/lite-yt-embed', () => mockImport, { virtual: true });
  //   jest.mock('lite-youtube-embed/src/lite-yt-embed.css', () => mockImport, { virtual: true });
    
  //   // Mock le composant enfant
  //   const MockComponent = () => <div>Test</div>;
    
  //   // Render MyApp
  //   render(<MyApp Component={MockComponent} pageProps={{}} />);
    
  //   // Vérifier que le code côté client est exécuté
  //   expect(mockUseEffect).toHaveBeenCalledTimes(1);
  //   expect(mockUseEffect).toHaveBeenCalledWith(expect.any(Function));
  // });

  // it('does not import lite-youtube-embed on server side', () => {
  //   // Simuler l'environnement serveur en définissant window comme undefined
  //   global.window = undefined;
    
  //   // Mock des imports dynamiques
  //   const mockImport = jest.fn().mockResolvedValue({});
  //   jest.mock('lite-youtube-embed/src/lite-yt-embed', () => mockImport, { virtual: true });
  //   jest.mock('lite-youtube-embed/src/lite-yt-embed.css', () => mockImport, { virtual: true });
    
  //   // Mock le composant enfant
  //   const MockComponent = () => <div>Test</div>;
    
  //   // Render MyApp
  //   render(<MyApp Component={MockComponent} pageProps={{}} />);
    
  //   // Vérifier que le code côté client n'est pas exécuté
  //   expect(mockUseEffect).not.toHaveBeenCalled();
  // });
});
