import '@testing-library/jest-dom';

// If needed, add global mocks here

// Make Jest functions available globally
global.jest = jest;

// Global mocks or setup can be placed here

// Mock CSS modules
jest.mock('*.module.css', () => ({}), { virtual: true });

// Mock next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
      push: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn()
      },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => null)
    };
  }
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  }
}));

// Mock next/head
jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }) => {
      return <>{children}</>;
    },
  };
});

// Add required browser APIs
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

// Make sure document is defined in test environment
if (typeof document === 'undefined') {
  require('./__mocks__/documentMock');
}

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
    this.elements = new Set();
    this.mockEntries = [];
  }

  observe(element) {
    this.elements.add(element);
  }

  unobserve(element) {
    this.elements.delete(element);
  }

  disconnect() {
    this.elements.clear();
  }

  // Simulate intersection change
  simulateIntersection(isIntersecting) {
    this.mockEntries = Array.from(this.elements).map(element => ({
      isIntersecting,
      target: element,
      intersectionRatio: isIntersecting ? 1 : 0,
      boundingClientRect: {},
      intersectionRect: {},
      rootBounds: null,
    }));
    
    this.callback(this.mockEntries, this);
  }
}

global.IntersectionObserver = MockIntersectionObserver;

// Mock window methods
global.window.scrollTo = jest.fn();
global.window.requestAnimationFrame = jest.fn(cb => cb());
