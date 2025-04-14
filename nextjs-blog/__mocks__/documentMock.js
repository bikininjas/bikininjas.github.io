// This file provides a minimal document mock for tests
Object.defineProperty(global, 'document', {
  value: {
    createElement: jest.fn(() => ({
      src: '',
      classList: {
        add: jest.fn(),
        remove: jest.fn()
      },
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    })),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    querySelector: jest.fn(() => null),
    querySelectorAll: jest.fn(() => [])
  },
  writable: true
});
